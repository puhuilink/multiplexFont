const { StaticFactory, DynamicFactory } = require('./Factory')
const { VIV_MAIN_MAPPING } = require('../config/daoMapping.js')

const exposed = {
  ...DynamicFactory.create(VIV_MAIN_MAPPING),
  ...StaticFactory.create()
}

module.exports = exposed
