/**
* 告警列表
* Author: dong xing
* Date: 2020/4/7
* Time: 10:55
* Email: dong.xing@outlook.com
*/
import anime from 'animejs'
import Element from './index'

export default class AlarmListElement extends Element {
  async mergeOption ({ proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { sourceType } = dataConfig

    switch (sourceType) {
      case 'real':
        if (loadingDynamicData) {
          try {
            // 返回接口参数
            this.updateProps({ params: dataConfig.dbDataConfig, isCallInterface: true })
          } catch (e) {
          } finally {
          }
        }
        break
    }

    anime.set(this.element, {
      ...proprietaryConfig.getOption()
    })
  }
}
