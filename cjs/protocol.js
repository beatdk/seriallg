const toggle = {
  on: '01',
  off: '00'
}

const range = [0, 100]

const any = [0, 255]

module.exports = {
  power: ['ka', toggle],
  input: ['xb', {
    dtv_antenna: '00',
    dtv_cable: '01',
    analog_antenna: '10',
    analog_cable: '11',
    av1: '20',
    av2: '21',
    component1: '40',
    component2: '41',
    rgb: '60',
    hdmi1: '90',
    hdmi2: '91',
    hdmi3: '92',
    hdmi4: '93'
  }],
  aspect_ratio: ['kc', {
    '4:3': '01',
    '16:9': '00',
    zoom: '06',
    auto: '09',
    cinema1: '10',
    cinema2: '11',
    cinema3: '12',
    cinema4: '13',
    cinema5: '14',
    cinema6: '15',
    cinema7: '16',
    cinema8: '17',
    cinema9: '18',
    cinema10: '19',
    cinema11: '1A',
    cinema12: '1B',
    cinema13: '1C',
    cinema14: '1D',
    cinema15: '1E',
    cinema16: '1F'
  }],
  screen_mute: ['kd', {
    on: '01',
    off: '00',
    out: '10'
  }],
  volume_mute: ['ke', toggle],
  volume: ['kf', range],
  contrast: ['kg', range],
  brightness: ['kh', range],
  color: ['ki', range],
  tint: ['kj', range],
  sharpness: ['kk', range],
  osd: ['kl', toggle],
  lock: ['km', toggle],
  treble: ['kr', range],
  bass: ['ks', range],
  balance: ['kt', range],
  basic_3d: ['xt', any, any, any, any],
  color_temperatur: ['xu', range],
  extended_3d: ['xv', any, any],
  ism: ['jp', {
    orbiter: '02',
    white_wash: '04',
    normal: '08',
    color_wash: '20'
  }],
  energy_saving: ['jq', {
    off: '00',
    minimum: '01',
    medium: '02',
    maximum: '03',
    auto: '04',
    screen_off: '05'
  }],
  auto_configuration: ['ju', '01'],
  channel_tuning: 'ma',
  channel_add_delete: 'mb',
  key: ['mc', any],
  backlight: ['mg', range]
}
