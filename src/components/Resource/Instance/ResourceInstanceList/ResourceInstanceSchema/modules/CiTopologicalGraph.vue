<template>
  <div class="CiTopologicalGraph">
    <div ref="relationTopologicalGraph" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import Timeout from 'await-timeout'
import _ from 'lodash'

export default {
  name: 'CiTopologicalGraph',
  components: {},
  props: {
    instance: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
  }),
  computed: {},
  watch: {
    instance: {
      immediate: true,
      deep: true,
      handler (v) {
        !_.isEmpty(v) && this.initChart()
      }
    }
  },
  methods: {
    initChart () {
      const setChart = async () => {
        const { label, pointInInstanceList, pointOutInstanceList } = this.instance
        // 等待 DOM 挂载
        await Timeout.set()
        const pointOutOption = pointOutInstanceList.map(({ target }) => ({
          name: target,
          target,
          symbolSize: 20,
          source: label,
          draggable: true
        }))
        const pointInOption = pointInInstanceList.map(({ source }) => ({
          name: source,
          source,
          symbolSize: 20,
          target: label,
          draggable: true
        }))
        const myChart = echarts.init(this.$refs['relationTopologicalGraph'])
        const centerPoint = {
          name: label,
          fixed: true,
          x: myChart.getWidth() / 2,
          y: myChart.getHeight() / 2,
          // 图形大小
          symbolSize: 20,
          id: label,
          draggable: false
        }
        const data = [
          centerPoint,
          ...pointOutOption,
          ...pointInOption
        ]
        const edges = [
          // centerPoint,
          ...pointOutOption,
          ...pointInOption
        ]
        // console.log(pointOutOption, pointInOption)
        const option = {
          toolbox: {
            show: true,
            feature: {
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          tooltip: {
            show: true
          },
          legend: [{
            data: data.map(({ name }) => name)
          }],
          series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            // 所有点
            data: data,
            force: {
              gravity: 0,
              repulsion: 100,
              // 点与点间距离
              edgeLength: 135
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [0, 10],
            // 点与点的连线关系
            links: edges.map(({ source, target }) => ({
              source: source,
              target: target
            }))
          }]
        }
        myChart.setOption(option)
      }
      // FIXME
      // window.addEventListener('resize', setChart)
      // this.$on('beforeDestroy', () => window.removeEventListener('resize', setChart))
      setChart()
    }
  }
}
</script>

<style lang="less">
.CiTopologicalGraph {
  overflow: hidden;
}
</style>
