/**
* 列表
*/
import anime from 'animejs'
import Element from './index'

export default class ListElement extends Element {
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
