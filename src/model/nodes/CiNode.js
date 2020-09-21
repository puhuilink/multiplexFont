import CircleNode from './CircleNode'
// import { AlarmService } from '@/api-hasura'
// import {
//   // NODE_CI_DRILL_TYPE_TAB,
//   // NODE_CI_DRILL_TYPE_VIEW
// } from './index'
// import _ from 'lodash'
import { emitter } from '../charts/TopologyChart'
import { AdaptorResourceConfig } from '../config/dataConfig/dynamicData/common/AdaptorResourceConfig'

export default class CiNode extends CircleNode {
  constructor ({ resourceConfig = {}, ...rest }) {
    super(rest)
    // console.log(resourceConfig)
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
  }

  async refresh () {
    await Promise.all([
      this.getOption(),
      this.getAlarm()
    ])
  }

  // 获取指标信息
  async getOption () {}

  // 获取告警信息
  async getAlarm () {
    const alarmLevel = await this.resourceConfig.latestAlarmLevel()
    console.log(alarmLevel, this.animateTypeList[alarmLevel])
    emitter.emit('animateType:change', {
      item: this,
      animateType: this.animateTypeList[alarmLevel]
    })
  }

  // async getOption () {
  //   const { animateType: defaultAnimateType, nodeDynamicDataConfig } = this
  //   const { resourceConfig: { selectedInstance } } = nodeDynamicDataConfig
  //   const [ciId] = selectedInstance
  //   const useRealAnimateType = defaultAnimateType === 'real'
  //   const tasks = [
  //     nodeDynamicDataConfig.getOption()
  //   ]

  //   // 从告警列表获取配置并以动画呈现
  //   if (useRealAnimateType && ciId) {
  //     tasks.push(
  //       AlarmService.find({
  //         where: {
  //           dev_name: ciId,
  //           // 0 代表未解决
  //           state: 0
  //         },
  //         limit: 1,
  //         alias: 'data'
  //       }).then(r => r.data[0])
  //         .then(r => _.get(r, 'severity'))
  //         .then(r => r ? `${r + 1}级告警` : 'none')
  //     )
  //   }

  //   // eslint-disable-next-line no-unused-vars
  //   const [realData, realAnimateType] = await Promise.all(tasks)

  //   const { attrList, kpiList } = realData

  //   // TODO: get the instance of graph
  //   // TODO: dynamic configure tooltip
  //   const graph = {}
  //   this.data = {
  //     attrList,
  //     kpiList
  //   }
  //   graph.setItemState(this, useRealAnimateType ? realAnimateType : defaultAnimateType, true)
  // }
}

// class NodeDynamicDataConfig {
//   constructor ({
//     resourceConfig = {
//       model: '',
//       selectedInstance: [],
//       selectedKpi: [],
//       selectedAttr: []
//     },
//     drillConfig = {
//       drillType: NODE_CI_DRILL_TYPE_VIEW,
//       viewList: []
//     }
//   }) {
//     this.resourceConfig = resourceConfig
//     this.drillConfig = drillConfig
//   }

//   fetch () {
//     const { resourceConfig } = this
//     return KpiCurrentService.getValue({
//       ...resourceConfig,
//       limit: 1
//     })
//   }

//   getOption () {
//     return this.fetch()
//   }
// }
