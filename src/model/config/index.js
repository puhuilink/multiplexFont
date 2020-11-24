/**
 * 配置
 * Author: dong xing
 * Date: 2020/3/26
 * Time: 13:58
 * Email: dong.xing@outlook.com
 */
import _ from 'lodash'
import Factory from '../factory/factory'
import CommonConfig from './commonConfig'
import DataConfig from './dataConfig'

// 图表专有属性工厂
const chartProprietaryConfigFactory = Factory.createChartProprietaryConfigFactory()

// 元素专有属性工厂
const elementProprietaryConfigFactory = Factory.createElementProprietaryConfigFactory()

export default class Config {
  constructor ({
    category, type, commonConfig, proprietaryConfig, dataConfig
  }) {
    this.category = category
    this.type = type
    this.commonConfig = new CommonConfig(commonConfig || {})
    this.proprietaryConfig = this.getProprietaryConfigFactory(category).create({
      type,
      proprietaryConfig
    })
    this.dataConfig = new DataConfig({
      widgetType: type,
      ...dataConfig
    })
  }

  /**
   * 根据分类获取其特配置工厂函数
   * @param category
   * @returns {*}
   */
  getProprietaryConfigFactory (category) {
    return category === 'ELEMENT' ? elementProprietaryConfigFactory : chartProprietaryConfigFactory
  }

  /**
   * 获取配置数据
   * @returns {*}
   */
  getOption () {
    if (this.type === 'Topology') {
      const {
        proprietaryConfig,
        ...restConfig
      } = this

      const edges = _.get(this, ['proprietaryConfig', 'edges'], [])
      const nodes = _.get(this, ['proprietaryConfig', 'nodes'], [])
      // delete runtime property

      return {
        proprietaryConfig: {
          ...proprietaryConfig,
          edges: edges.map(edge => _.omit(edge, ['sourceNode', 'targetNode'])),
          nodes: nodes.map(node => _.omit(node, ['tooltipContent']))
        },
        ...restConfig
      }
    }

    return { ...this }
  }
}
