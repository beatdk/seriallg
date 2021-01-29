import TV from '../src/index.js'
import { t } from 'fantestic'

t('Turns on TV', async() => {
  const tv = TV({ id: 1 })

  return [
    'on',
    await tv.power.on(),
    tv.close()
  ]
})
