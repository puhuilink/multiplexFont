export default class GaugeDataConfig {
  constructor (options = {}) {
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
  }

  getOption () {
    return Object.assign({}, this)
  }
}
