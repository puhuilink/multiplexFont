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
  data () {
    return {
      // wxImg: bk_wx,
      datatime: []
    }
  },
  mounted () {
    this.gettime()
    this.drawPolicitalStatus()
  },

  methods: {
    gettime () {
      // 获取当前日期
      const currentDate = new Date()

      // 获取年、月、日
      const year = currentDate.getFullYear()
      // eslint-disable-next-line no-unused-vars
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      // eslint-disable-next-line no-unused-vars
      const day = String(currentDate.getDate()).padStart(2, '0')

      // 生成日期数组
      const data = []
      for (let i = 0; i < 10; i++) {
        const date = new Date(year, currentDate.getMonth(), currentDate.getDate() - (9 - i))
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        data.push(formattedDate)
      }
      this.datatime = data
      console.log(this.datatime)
    },
    drawPolicitalStatus () {
      const that = this
      console.log(that.datatime)
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
          data: that.datatime
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
            name: '紧急',
            type: 'line',
            data: [216, 389, 1990, 46, 140, 808, 1126, 2015, 586, 2],

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
            name: '高危',
            type: 'line',
            data: [289, 1486, 2058, 167, 567, 799, 3419, 11392, 823, 56],

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
            name: '中危',
            type: 'line',
            data: [101, 831, 144, 52, 98, 139, 307, 1103, 85, 12],
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
            name: '低危',
            type: 'line',
            data: [174, 307, 121, 126, 587, 307, 4138, 4501, 240, 14],
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

<style lang="less" >
.contentEch {
  padding: 0 0px 0px 37px;
}

.appContainerbox{
  margin-top: 20px;
}
.echarts {
  height: 300px;
  width: 100%;
}
</style>
