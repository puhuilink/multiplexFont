<template>
  <div class="appContainer01">
    <div class="titleTop">{{ title }}</div>
    <div class="contentX contentleft" v-if="type == '1'">
      <div class="img-one">
        <div class="top">
          <div class="text">{{ content[0].text }}</div>
          <!-- <div class="number">{{ content[0].number }}</div> -->
          <formatterNumber class="number" :number="content[0].number" />
        </div>
        <div class="bottom">
          <div class="bottom-content-left">
            <div class="text">{{ content[1].text }}</div>
            <!-- <div class="number">{{ content[1].number }}</div> -->
            <formatterNumber class="number" :number="content[1].number" />
          </div>
          <div class="bottom-content-right">
            <div class="text">{{ content[2].text }}</div>
            <!-- <div class="number">{{ content[2].number }}</div> -->
            <formatterNumber class="number" :number="content[2].number" />
          </div>
        </div>
      </div>
    </div>
    <div class="contentX" v-else>
      <div class="img-two">
        <!-- <div class="number">{{ content[0].number }}</div> -->
        <formatterNumber class="number" :number="content[0].number" />
        <div class="text">{{ content[0].text }}</div>
        <div class="bottom">
          <div class="bottom-content-left">
            <!-- <div class="number">{{ content[1].number }}</div> -->
            <formatterNumber class="number" :number="content[1].number" />
            <div class="text">{{ content[1].text }}</div>
          </div>
          <div class="bottom-content-right">
            <!-- <div class="number">{{ content[2].number }}</div> -->
            <formatterNumber class="number" :number="content[2].number" />
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

import formatterNumber from './formatterNumber.vue';
import * as echarts from 'echarts'
export default {
  name: 'wx-ship',
  components: {
    formatterNumber,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    title1: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    content: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {

    };
  },
  mounted() {
    this.drawPolicitalStatus();
  },
  /* methods: {
    drawPolicitalStatus() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(this.$refs.canvas01);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          show: true,
          trigger: 'item',
        },
        legend: {
          top: '5%',
          icon: 'circle',
          textStyle: {
            fontSize: 11, //字体大小
            color: 'rgba(255,255,255,0.7)', //字体颜色
          },
          left: 'left',
          selectedMode: false,
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            itemStyle: {
              borderWidth: 10,
              borderColor: '#0D253D',
            },
            label: {
              formatter: '{d}%',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12, //字体大小
            },
            labelLine: {
              length: 0, // 第一段引导线的长度
              length2: 30, // 第二段引导线的长度
              show: true,
            },
            data: this.data,
          },
        ],
      });
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },
  }, */
  methods: {
    drawPolicitalStatus() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.canvas01);
      /* let data = this.content.bottomData;
      if (data.length !== undefined && data[0].hasOwnProperty('count')) {
        data.forEach((item) => {
          return (item.threatNum = item.count);
        });
      }
      if (data.length !== undefined) {
        data = data.map((item) => item.threatNum);
      } */
      // 绘制图表
      myChart.setOption({
        title: {
          subtext: '等级分布',
          left: 'center',
          top: '48%',
          subtextStyle: {
            fontFamily: '微软雅黑',
            fontSize: 18,
            color: '#fff',
          },
        },
        tooltip: {
          show: true,
          //   trigger: 'item',
          trigger: 'none',
        },
        legend: {
          top: '5%',
          icon: "circle",
          textStyle: {
            fontSize: 15, //字体大小
            color: 'rgba(255,255,255,0.7)', //字体颜色
          },
          left: 37,
          selectedMode: false,
          data: ['紧急', '高危', '中危', '低危'],
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '58%'], // 将饼状图的中心位置调整为离左侧30%、垂直居中
            radius: ['44%', '65%'],
            itemStyle: {
              borderWidth: 10,
              borderColor: '#0D253D',
            },
            label: {
              normal: {
                formatter: '{d}%',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 15, //字体大小
              },
            },
            labelLine: {
              normal: {
                // show: false,
                length: 0,
                length2: 80,
              },
            },
            itemStyle: {
              normal: {
                borderWidth: 4, //设置border的宽度有多大
                borderColor: '#0C233A',
              },
            },
            data: [
              {
                value: 15,
                name: '紧急',
                itemStyle: {
                  normal: {
                    color: '#DC5656',
                  },
                  emphasis: {
                    color: '#DC5656',
                  },
                },
              },
              {
                value: 56,
                name: '高危',
                itemStyle: {
                  normal: {
                    color: '#FFA044',
                  },
                  emphasis: {
                    color: '#FFA044',
                  },
                },
              },
              {
                value: 9,
                name: '中危',
                itemStyle: {
                  normal: {
                    color: '#EAE174',
                  },
                  emphasis: {
                    color: '#EAE174',
                  },
                },
              },
              {
                value: 20,
                name: '低危',
                itemStyle: {
                  normal: {
                    color: '#3CA6FF',
                  },
                  emphasis: {
                    color: '#3CA6FF',
                  },
                },
              },
            ],
          },
        ],
      });
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },
  },
};
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
    width: 308px;
    margin-left: 29.5px;
    background: url('./img/bk_wx.png') no-repeat;
    background-size: contain;
    overflow: hidden;

    .top {
      border-radius: 50%;
      margin: auto;
      margin-top: 8.79px;

      .text {
        margin-top: 89px;
        text-align: center;
        height: 15px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0ac6e0;
        line-height: 15px;
      }

      .number {
        text-align: center;
        margin-top: 9px;
        height: 15px;
        font-size: 24px;
        font-family: LetsgoDigital-Regular, LetsgoDigital;
        font-weight: 400;
        color: #ffffff;
        line-height: 15px;
      }
    }

    .bottom {
      display: flex;
      border-radius: 50%;
      margin: auto;

      .bottom-content-left {
        width: 50%;
        height: 50%;
        margin-left: 5px;
        margin-top: -5px;
      }

      .bottom-content-right {
        width: 50%;
        height: 50%;
        margin-left: -6px;
        margin-top: -5px;
      }

      .text {
        margin-top: 87.5px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0ac6e0;
        line-height: 9px;
      }

      .number {
        margin-top: 9px;
        text-align: center;

        height: 15px;
        font-size: 24px;
        font-family: LetsgoDigital-Regular, LetsgoDigital;
        font-weight: 400;
        color: #ffffff;
        line-height: 15px;
      }
    }
  }

  .img-two {
    height: 272.5px;
    width: 308px;
    background: url('./img/bk_wx1.png');
    background-size: contain;
    overflow: hidden;
    margin-left: 51px;

    .text {
      margin-top: 31px;
      text-align: center;
      height: 15px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #90c8f4;
      line-height: 15px;
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
        height: 50%;
        margin-right: 20px;
      }

      .bottom-content-right {
        width: 50%;
        height: 50%;
        margin-left: 17px;
      }

      .number {
        margin-top: 69.5px;
        height: 27px;
        font-size: 27px;
        font-family: LetsgoDigital-Regular, LetsgoDigital;
        font-weight: 400;
        color: #ffffff;
        line-height: 27px;
        text-align: center;
      }

      .text {
        margin-top: 31px;
        text-align: center;
        height: 15px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #90c8f4;
        line-height: 15px;
      }
    }
  }
}

.content1 {
  height: 250px;
}

.titleTop {
  height: 18px;
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #5bbbff;
  line-height: 18px;
  padding-left: 37px;
  // margin-top: 27px;
  margin-bottom: 12;
}

.echarts {
  height: 100%;
  width: 100%;
}
</style>
