import _ from 'lodash'
import Element from '@/model/element/index'

export default class SelectElement extends Element {
  async mappingOption ({ proprietaryConfig }) {
    return _.cloneDeep({
      ...proprietaryConfig.getOption()
    })
  }
}
