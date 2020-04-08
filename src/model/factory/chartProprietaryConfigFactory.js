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
import ClockProprietaryConfig from '../config/proprietaryConfigs/ClockProprietaryConfig'
import RectProprietaryConfig from '../config/proprietaryConfigs/RectProprietaryConfig'
import CircleProprietaryConfig from '../config/proprietaryConfigs/CircleProprietaryConfig'
import TriangleChartProprietaryConfig from '../config/proprietaryConfigs/TriangleProprietaryConfig'
import ImageProprietaryConfig from '../config/proprietaryConfigs/ImageProprietaryConfig'
import GaugePropritaryConfig from '../config/proprietaryConfigs/GaugePropritaryConfig'

export default class ChartProprietaryConfigFactory {
  static create ({ type, proprietaryConfig = {} }) {
    switch (type) {
      case 'Lines':
        return new LinesProprietaryConfig(proprietaryConfig)
      case 'Bar':
        return new BarProprietaryConfig(proprietaryConfig)
      case 'Texts':
        return new TextsProprietaryConfig(proprietaryConfig)
      case 'Clock':
        return new ClockProprietaryConfig(proprietaryConfig)
      case 'Topology':
        return new TopologyProprietaryConfig(proprietaryConfig)
      case 'Rect':
        return new RectProprietaryConfig(proprietaryConfig)
      case 'Circle':
        return new CircleProprietaryConfig(proprietaryConfig)
      case 'Triangle':
        return new TriangleChartProprietaryConfig(proprietaryConfig)
      case 'Image':
        return new ImageProprietaryConfig(proprietaryConfig)
      case 'View':
        return new ViewProprietaryConfig(proprietaryConfig)
      case 'HealthDegree':
        return new HealthDegreeProprietaryConfig(proprietaryConfig)
      case 'Gauge':
        return new GaugePropritaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
