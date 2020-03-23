/**
* 图表专有属性配置工厂
* Author: dong xing
* Date: 2019/11/19
* Time: 5:37 下午
* Email: dong.xing@outlook.com
*/
import LinesProprietaryConfig from '../config/proprietaryConfigs/LinesProprietaryConfig'
import BarProprietaryConfig from '../config/proprietaryConfigs/BarProprietaryConfig'
import TopologyProprietaryConfig from '../config/proprietaryConfigs/TopologyProprietaryConfig'
import ViewProprietaryConfig from '../config/proprietaryConfigs/ViewProprietaryConfig'
import TextsProprietaryConfig from '../config/proprietaryConfigs/TextsProprietaryConfig'
import HealthDegreeProprietaryConfig from '../config/proprietaryConfigs/HealthDegreeProprietaryConfig'

export default class ChartProprietaryConfigFactory {
  static create ({ type, proprietaryConfig = {} }) {
    switch (type) {
      case 'Lines':
        return new LinesProprietaryConfig(proprietaryConfig)
      case 'Bar':
        return new BarProprietaryConfig(proprietaryConfig)
      case 'Texts':
        return new TextsProprietaryConfig(proprietaryConfig)
      case 'Topology':
        return new TopologyProprietaryConfig(proprietaryConfig)
      case 'ViewConfig':
        return new ViewProprietaryConfig(proprietaryConfig)
      case 'HealthDegree':
        return new HealthDegreeProprietaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
