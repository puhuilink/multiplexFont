/**
* 告警列表动态数据配置
* Author: dong xing
* Date: 2020/4/7
* Time: 14:47
* Email: dong.xing@outlook.com
*/

export default class AlarmListDynamicDataConfig {
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
