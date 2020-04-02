import _ from 'lodash'
import { getComponentValues } from '@/api/controller/View'

export default class BarDataConfig {
  constructor ({ model, selectedInstance, selectedKpi }) {
    this.model = model
    this.selectedInstance = selectedInstance
    this.selectedKpi = selectedKpi
  }

  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    const { model, selectedInstance, selectedKpi } = this
    const res = await getComponentValues({ model, selectedInstance, selectedKpi })
    // 按 instance 进行分组
    const groupedData = _.groupBy(res, 'instanceLabel')
    console.log(res, groupedData)
    // TODO: 此处为单列数据展示
    const data = {
      legend: {},
      xAxis: {
        type: 'category',
        data: Object.keys(groupedData)
      },
      yAxis: {
        type: 'value'
      },
      singleSeries: Object.keys(groupedData).map(key => ({
        type: 'bar',
        // 多列
        stack: null,
        name: key,
        data: groupedData[key].map(item => item ? item.value : 0)
      }))
      // singleSeries: res.map(({ instanceLabel, value }, index) => ({
      //   type: 'bar',
      //   stack: 'stack',
      //   name: instanceLabel,
      //   data: (() => {
      //     // FIXME: 格式是否必须为数组
      //     const arr = new Array(res.length).fill(0)
      //     arr[index] = value
      //     return arr
      //   })()
      // }))
    }
    console.log(data)
    return data
  }
}
