export default class BareDataConfig {
  constructor (options = {}) {
    // FIXME: 此处为了快速开发，简写了入参的格式
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
  }

  getOption () {
    return Object.assign({}, this)
  }
}
