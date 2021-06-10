const Connection = require('./connection.js')
const protocol = require('./protocol.js')

module.exports = function(options = {}) {
  const {
    id = 0,
    retries = 5,
    retryTimeout = 2000
  } = options

  const tv = Object.entries(protocol).reduce((acc, [k, v]) => {
    const [command, value] = Array.isArray(v) ? v : [v]
        , range = Array.isArray(value)
        , enums = !range && value
        , enumMap = enums && Object.entries(enums).reduce((xs, [k, v]) => ({ ...xs, [v]: k }), {})

    const fn = acc[k] = (...data) => {
      return data.length
        ? set(command, data).then(returnValue)
        : get(command).then(returnValue)
    }

    enums && Object.entries(enums).forEach(([k, v]) =>
      fn[k] = () => set(command, [v]).then(returnValue)
    )

    fn.raw = (...data) => send(command, ...data)

    function returnValue(x) {
      return enumMap ? enumMap[x] : range ? parseInt(x, 16) : x
    }

    return acc
  }, {})

  tv.raw = send
  tv.close = async() => (await Connection(options)).close()

  return tv

  async function set(command, data) {
    const result = await send(command, data)

    let tried = retries
    while (tried && await get(command).catch(() => null) !== result) {
      tried--
      await new Promise(r => setTimeout(r, retryTimeout))
    }

    return result
  }

  async function get(command) {
    return send(command, ['FF'])
  }

  async function send(command, data) {
    return (await Connection(options)).send(command, id, data.map(stringify))
  }
}

function stringify(x) {
  typeof x === 'number' && (x = x.toString(16))
  return (x.length === 1 ? '0' : '') + x
}
