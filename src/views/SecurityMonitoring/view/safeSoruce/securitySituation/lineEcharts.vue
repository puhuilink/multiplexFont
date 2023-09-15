<template>
  <div class="appContainerbox">
    <div class="contentEch">
      <div ref="canvas03" class="echarts"></div>
    </div>
  </div>
</template>

<script>

import * as echarts from 'echarts'

export default {
  name: 'LineEcharts',
  props: {
    threadData: {
      type: null,
      default: []
    }
  },
  data () {
    return {
      // wxImg: bk_wx,
      datatime: []
    }
  },
  mounted () {
    this.drawPolicitalStatus()
  },
  watch: {
    threadData: function () {
      // 在chartData变化时，手动重新渲染图表
      this.drawPolicitalStatus()
    }
  },
  methods: {
    formatTimestampToDateString (timestamp) {
      const date = new Date(parseInt(timestamp))
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    drawPolicitalStatus () {
      const formattedData = this.threadData.map(item => ({
        ...item,
        time: this.formatTimestampToDateString(item.time)
      }))
      const middleNumData = []
      const highNumData = []
      const crisisNumData = []
      const lowNumData = []
      const timeData = []

      // 使用 forEach 循环处理数据
      formattedData.forEach(item => {
        middleNumData.push(item.middleNum)
        highNumData.push(item.highNum)
        crisisNumData.push(item.crisisNum)
        lowNumData.push(item.lowNum)
        timeData.push(item.time)
      })
      // console.log(middleNumData, highNumData, crisisNumData, lowNumData, timeData)
      // 基于准备好的dom，初始化echarts实例
      const myChart03 = echarts.init(this.$refs.canvas03)
      // 绘制图表
      myChart03.setOption({
        title: {
          text: '威胁趋势',
          textStyle: {
            fontWeight: '600',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontSize: 18,
            color: '#5BBBFF'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // icon: 'circle',
          icon: 'path://M100,0c4.85,0,9.4,.92,13.63,2.75s7.93,4.34,11.11,7.51c3.17,3.17,5.68,6.89,7.51,11.15s2.75,8.82,2.75,13.67-.92,9.3-2.75,13.53c-1.84,4.23-4.34,7.93-7.51,11.11-3.17,3.17-6.88,5.68-11.11,7.51s-8.77,2.75-13.63,2.75-9.4-.92-13.63-2.75-7.93-4.34-11.11-7.51c-3.17-3.17-5.68-6.88-7.51-11.11s-2.75-8.74-2.75-13.53c0-4.85,.92-9.41,2.75-13.67s4.34-7.98,7.51-11.15c3.17-3.17,6.88-5.68,11.11-7.51C90.6,.92,95.15,0,100,0Z M0,29h200v12h-200',
          textStyle: {
            fontSize: '100%', // 字体大小
            color: '#000', // 字体颜色
            padding: [2, 25, 0, 0]
          },
          left: 130,
          selectedMode: false,
          data: ['紧急', '高危', '中危', '低危']
        },
        grid: {
          left: '0%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#3B6F9F' // x轴的颜色
            }
          },
          axisLabel: {
            color: '#A6A6A6'
          },
          data: timeData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3B6F9F' // x轴的颜色
            }
          },
          axisLabel: {
            color: '#A6A6A6'
          },
          splitLine: {
            lineStyle: {
              // 设置背景横线
              color: '#3B6F9F',
              type: 'dotted'
            }
          }
        },
        series: [
          {
            name: '紧急', // crisisNum
            type: 'line',
            data: crisisNumData,

            itemStyle: {
              normal: {
                color: '#DC5656'
              },
              emphasis: {
                color: '#DC5656'
              }
            }
          },
          {
            name: '高危', // highNum
            type: 'line',
            data: highNumData,

            itemStyle: {
              normal: {
                color: '#FFA044'
              },
              emphasis: {
                color: '#FFA044'
              }
            }
          },
          {
            name: '中危', // middleNum
            type: 'line',
            data: middleNumData,
            itemStyle: {
              normal: {
                color: '#EAE174'
              },
              emphasis: {
                color: '#EAE174'
              }
            }
          },
          {
            name: '低危', // lowNum
            type: 'line',
            data: lowNumData,
            itemStyle: {
              normal: {
                color: '#3CA6FF'
              },
              emphasis: {
                color: '#3CA6FF'
              }
            }
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart03.resize()
      })
    }
  }
}
</script>

<style lang="less">
.contentEch {
  padding: 0 0px 0px 37px;
}

.appContainerbox {
  margin-top: 20px;
}

.echarts {
  height: 300px;
  width: 100%;
}
</style>
