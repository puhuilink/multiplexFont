export default class ListDataConfig {
  constructor ({
    resourceConfig = {
      domains: '',
      model: '',
      selectedInstance: [],
      selectedKpi: [],
      alarmType: [],
      collectionSystem: []
    },
    refreshTime = 0
  }) {
    this.resourceConfig = resourceConfig
    this.refreshTime = refreshTime
  }
}
