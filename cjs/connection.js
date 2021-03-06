const SP = require('serialport')

const connections = {}

async function list() {
  return (await SP.list()).map(x => (
    x.path = x.path || x.comName,
    x
  ))
}

module.exports = async function Connection({
  idleTimeout = 10000,
  queryTimeout = 2000,
  retries = 5,
  path
} = {}) {
  path = typeof path === 'function'
    ? path(await list())
    : path
    || ((await list()).sort((a, b) => b.path.localeCompare(a.path)).find(x => x.path.match('usbserial|COM[0-9]|ttyUSB')) || {}).path

  if (path in connections)
    return connections[path]

  let queue = []

  const c = new SP(path)

  c.setEncoding('utf8')

  let message = ''
    , idleTimer
    , queryTimer
    , open = false
    , current

  c.on('open', () => {
    open = true
    next()
  })

  c.on('data', function ondata(x) {
    startIdleTimeout(idleTimer)
    message += x
    const idx = message.indexOf('x')

    if (idx === -1)
      return

    current && handle(message.slice(message.indexOf(' ') - 1, idx))
    message = message.slice(idx + 1)
  })

  c.on('error', end)
  c.on('close', end)

  return connections[path] = ({
    close: () => new Promise(resolve => c.close(() => (end(), resolve()))),
    send(command, id, data) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject, command, id, data, retries })
        next()
      })
    }
  })

  function next() {
    open && queue.length && !current && write(current = queue.shift())
  }

  function startIdleTimeout() {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => (end(new Error('Idle Timeout')), c.close(end)), idleTimeout)
  }

  function queryTimedOut() {
    if (!current)
      return

    current.retries-- > 0
      ? write(current)
      : (current.reject(new Error('Query Timed Out')), current = null)
  }

  function write(x) {
    startIdleTimeout()
    queryTimer = setTimeout(queryTimedOut, queryTimeout)
    message = ''
    c.write([x.command, x.id, ...x.data].join(' ') + '\r')
  }

  function handle(x) {
    clearTimeout(queryTimer)
    const [command, id, status, data] = (x.match(/([a-zA-Z]) ([0-9]{2}) (OK|NG)([0-9a-zA-Z]+)/) || []).slice(1)

    if (!command)
      current.reject('Malformed reply ' + x)
    else if (current.command[1] !== command)
      current.reject('Wrong command in reply - got ' + command + ' expected ' + current.command[1])
    else if (status === 'OK' || (data === '00' && current.command === 'ka' && current.data[0] === '00'))
      current.resolve(data)
    else
      current.reject(data)

    current = null
    next()
  }

  function end(err) {
    if (path in connections === false)
      return

    delete connections[path]
    clearTimeout(idleTimer)
    current && current.reject(err)
    queue.forEach(x => x.reject(err))
    queue = []
  }
}
