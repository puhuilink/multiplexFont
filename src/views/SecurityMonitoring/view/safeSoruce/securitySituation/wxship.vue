<template>
  <div class="appContainer01">
    <div class="titleTop">{{ title }}</div>
    <div class="contentX contentleft" v-if="type == '1'">
      <div class="img-one">
        <div class="top">
          <div class="text">{{ content[0].text }}</div>
          <!-- <div class="number">{{ content[0].number }}</div> -->
          <formatterNumber class="number" :number="content[0].number" :colors="color_white" />
        </div>
        <div class="bottom_top">
          <div class="bottom-content-left">
            <div class="text">{{ content[1].text }}</div>
            <formatterNumber class="number" :number="content[1].number" :colors="color_white" />
          </div>
          <div class="bottom-content-right">
            <div class="text">{{ content[2].text }}</div>
            <formatterNumber class="number" :number="content[2].number" :colors="color_white" />
          </div>
        </div>
      </div>
    </div>
    <div class="contentX" v-else>
      <div class="img-two">
        <formatterNumber class="number" :number="content[0].number" :colors="color_black" />
        <div class="text">{{ content[0].text }}</div>
        <div class="bottom">
          <div class="bottom-content-left">
            <formatterNumber class="number" :number="content[1].number" :colors="color_black" />
            <div class="text">{{ content[1].text }}</div>
          </div>
          <div class="bottom-content-right">
            <formatterNumber class="number" :number="content[2].number" :colors="color_black" />
            <div class="text">{{ content[2].text }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="titleTop">{{ title1 }}</div>
    <div class="content1">
      <div ref="canvas01" class="echarts"></div>
    </div>
  </div>
</template>

<script>

import formatterNumber from './formatterNumber.vue'
import * as echarts from 'echarts'

export default {
  name: 'WxShip',
  components: {
    formatterNumber
  },
  props: {
    title: {
      type: null,
      default: ''
    },
    title1: {
      type: null,
      default: ''
    },
    type: {
      type: null,
      default: ''
    },
    content: {
      type: null,
      default: []
    },
    data: {
      type: null,
      default: []
    }
  },

  data () {
    return {
      color_black: '#000',
      color_white: '#fff'
    }
  },
  mounted () {
    this.drawPolicitalStatus()
  },
  watch: {
    data: function () {
      // 在chartData变化时，手动重新渲染图表
      this.drawPolicitalStatus()
    }
  },
  methods: {
    drawPolicitalStatus () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.canvas01)
      // 整理数据并写入示例的ECharts数据

      const echartsData = this.data.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          normal: {
            color: item.itemStyle.color
          },
          emphasis: {
            color: item.itemStyle.color
          }
        }
      }))
      const nameArray = this.data.map(item => item.name).reverse()

      // 绘制图表
      myChart.setOption({
        title: {
          subtext: '等级分布',
          left: 'center',
          top: '49%',
          subtextStyle: {
            fontFamily: '微软雅黑',
            fontSize: '150%',
            color: '#000'
          }
        },
        tooltip: {
          show: true,
          trigger: 'item'
          // trigger: 'none'
        },
        legend: {
          top: '5%',
          icon: 'circle',
          textStyle: {
            fontSize: '110%', // 字体大小
            color: '#000', // 字体颜色
            padding: [2, 15, 0, 0]
          },
          left: '7%',
          selectedMode: false,
          data: nameArray.length > 0 ? nameArray : ['危急', '高危', '中危', '低危']
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '58%'], // 将饼状图的中心位置调整为离左侧30%、垂直居中
            radius: ['44%', '65%'],
            label: {
              formatter: '{d}%',
              color: '#000',
              fontSize: 18 // 字体大小
            },
            labelLine: {
              normal: {
                // show: false,
                length: 0,
                length2: '15%',
                lineStyle: {
                  color: '#000' // 设置 labelLine 的颜色为黑色
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 6, // 设置border的宽度有多大
                borderColor: '#fff'
              }
            },
            data: echartsData
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.appContainer01 {
  width: 425px;
  height: 604px;
}

.contentleft {
  padding-left: 37px;
}

.contentX {
  margin-top: 13px;
  margin-bottom: 33px;

  .img-one {
    height: 272.5px;
    width: 295px;
    margin-left: 35px;
    background: url('./img/bk_wx.png') no-repeat;
    background-size: contain;
    overflow: hidden;

    .top {
      border-radius: 50%;
      margin: auto;
      margin-top: 8.79px;

      .text {
        margin-top: 70px;
        text-align: center;
        height: 15px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
        line-height: 15px;
      }

      .number {
        text-align: center;
        //margin-left: 20px;
        height: 40px;
        font-size: 40px;
        font-family: LetsgoDigital-Regular, LetsgoDigital;
        font-weight: 400;
        color: #ffffff;
        line-height: 40px;
      }
    }

    .bottom_top {
      display: flex;
      border-radius: 50%;
      margin: auto;

      .bottom-content-left {
        width: 50%;
        height: 50%;
      }

      .bottom-content-right {
        width: 50%;
        height: 50%;
        margin-left: 20px;
      }

      .text {
        margin-top: 80px;
        text-align: center;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #fff;
        line-height: 18px;
      }

      .number {
        text-align: center;
        font-size: 24px;
        font-family: LetsgoDigital-Regular, LetsgoDigital;
        font-weight: 400;
        color: #ffffff;
        line-height: 24px;
      }
    }
  }

  .img-two {
    height: 272.5px;
    width: 295px;
    background: url('./img/bk_wx1.png') no-repeat;
    background-size: contain;
    overflow: hidden;
    margin-left: 51px;

    .text {
      margin-top: 10px;
      margin-bottom: 40px;
      text-align: center;

      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #90c8f4;
      line-height: 20px;
    }

    .number {
      margin-top: 35px;
      height: 27px;
      font-size: 27px;
      font-family: LetsgoDigital-Regular, LetsgoDigital;
      font-weight: 400;
      color: #ffffff;
      line-height: 27px;
      text-align: center;
    }

    .bottom {
      display: flex;
      border-radius: 50%;

      //   margin-top:63px;
      .bottom-content-left {
        width: 50%;

      }

      .bottom-content-right {
        width: 50%;

        margin-left: 20px;
      }

      .number {
        margin-top: 35px;
        height: 27px;
        font-size: 27px;
        font-family: LetsgoDigital-Regular, LetsgoDigital;
        font-weight: 400;
        color: #ffffff;
        line-height: 27px;
        text-align: center;
      }

      .text {
        margin-top: 10px;
        margin-bottom: 40px;
        text-align: center;

        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #90c8f4;
        line-height: 20px;
      }
    }
  }
}

.content1 {
  height: 250px;
}

.titleTop {
  height: 18px;
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #0060A3;
  line-height: 18px;
  padding-left: 37px;
}

.echarts {
  height: 100%;
  width: 100%;
}
</style>
