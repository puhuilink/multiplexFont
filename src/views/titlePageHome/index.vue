<template>
  <div style="padding: 0;background: #EFF0F4 ">
    <div class="shortcut">
      <div class="shortcut_1">快捷功能</div>
      <div style="display: flex;padding-left: 15px;overflow-x: scroll; ">
        <div v-for="(item, index) in menuItems" :key="index">
          <a @click="tiaozhuan(item.route)">
            <titleColor :img="item.img" :font="item.label"></titleColor>
          </a>
        </div>
      </div>
    </div>

    <a-row class="a-row_1">
      <a-col :span="12" class="row_1_col_1">
        <a-radio-group v-model="value" buttonStyle="solid" @change="onChange">
          <a-radio-button value="title">知识标题</a-radio-button>
          <a-radio-button value="category">知识分类</a-radio-button>
          <a-radio-button value="keyword">关键字</a-radio-button>
          <a-radio-button value="summary">内容摘要</a-radio-button>
          <a-radio-button value="content">知识正文</a-radio-button>
        </a-radio-group>
        <a-input-search
          placeholder="请输入您要查找的知识内容"
          class="row_1_col_1_input"
          @search="onSearch"
          size="large"
          :loading="loadingInput"/>
        <a-badge status="processing" color="#EFA24F" text="紧急告警该如何快速有效处置?" class="row_1_col_1_badge"/>
        <a-badge status="processing" color="#EFA24F" text="机房运维发现问题如何处理?" class="row_1_col_1_badge"/>
        <a-badge status="processing" color="#EFA24F" text="统一监控章程是什么??" class="row_1_col_1_badge"/>
        <a-badge status="processing" color="#EFA24F" text="紧急告警该如何快速有效处置?" class="row_1_col_1_badge"/>
        <a-badge status="processing" color="#EFA24F" text="机房运维发现问题如何处理?" class="row_1_col_1_badge"/>
        <a-badge status="processing" color="#EFA24F" text="统一监控章程是什么??" class="row_1_col_1_badge"/>
      </a-col>
      <a-col :span="12" class="row_1_col_2">
        <span class="row_1_col_2_head">平台简介</span>
        <span v-html="text_txt" class="row_1_col_2_text"></span>
      </a-col>
    </a-row>

    <a-row class="a-row_2">
      <a-col :span="12" class="a-row_2_col_left">
        <span class="row_1_col_2_head">我的待办</span>

        <a-table :columns="columns" :data-source="data" :pagination="false" size="middle">
          <a slot="color" slot-scope="text, record">
            <a-badge :color="record.color"></a-badge>
          </a>
          <span slot="action" slot-scope="text, record">
            <a @click="disposal(record)">处置</a>
          </span>
        </a-table>
      </a-col>
      <a-col :span="12" class="a-row_2_col_right">
        <span class="row_1_col_2_head">我的申请</span>

        <a-table :columns="columns2" :data-source="data2" :pagination="false" size="middle">
          <a slot="color" slot-scope="text, record">
            {{ record.color }}
          </a>
          <span slot="action" slot-scope="text, record">
            <a @click="disposal(record)">查看</a>
          </span>
        </a-table>
      </a-col>
    </a-row>

    <a-row class="a-row_3">
      <a-col :span="12" class="a-row_3_col_left">
        <span class="row_1_col_3_head">资产分布情况</span>
        <div class="echartsBox1" style="height: 225px"></div>
      </a-col>
      <a-col :span="12" class="a-row_3_col_right">
        <span class="row_1_col_3_head">资产状态分布图</span>
        <div class="echartsBox2" style="height: 225px"></div>
      </a-col>
    </a-row>
    <!--    <a-row>-->
    <!--      <a-col :span="24" style="margin-top: 40px;font-size: 28px">机房导览</a-col>-->
    <!--    </a-row>-->

  </div>
</template>

<script>
import titleColor from './components/title'
// import blockImg from './components/block'
import { axios } from '@/utils/request'
import * as echarts from 'echarts'
const columns = [
  {
    title: '告警级别',
    key: 'color',
    align: 'center',
    scopedSlots: { customRender: 'color' }
  },
  {
    title: '告警标题',
    dataIndex: 'headline',
    align: 'center',
    key: 'headline'
  },
  {
    title: '告警类型',
    dataIndex: 'type',
    align: 'center',
    key: 'type'
  },
  {
    title: '告警源IP',
    key: 'IP',
    align: 'center',
    dataIndex: 'IP'
  },
  {
    title: '告警时间',
    key: 'Alarm_time',
    align: 'center',
    dataIndex: 'Alarm_time'
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    key: '1',
    color: '#F73030',
    headline: 'PIGOSS',
    type: 'usage',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12 11:40:39',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    color: '#FF8745',
    headline: 'PIGOSS',
    type: 'usage',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12 11:40:39',
    tags: ['loser']
  },
  {
    key: '3',
    color: '#F0B144',
    headline: 'PIGOSS',
    type: 'usage',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12 11:40:39',
    tags: ['cool', 'teacher']
  },
  {
    key: '4',
    color: '#B592E4',
    headline: 'PIGOSS',
    type: 'usage',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12 11:40:39',
    tags: ['cool', 'teacher']
  },
  {
    key: '5',
    color: '#3F78F0',
    headline: 'PIGOSS',
    type: 'usage',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12 11:40:39',
    tags: ['cool', 'teacher']
  }
]
const columns2 = [
  {
    title: '工单编号',
    key: 'color',
    align: 'center',
    scopedSlots: { customRender: 'color' }
  },
  {
    title: '标题',
    dataIndex: 'headline',
    align: 'center',
    key: 'headline'
  },
  {
    title: '状态',
    dataIndex: 'type',
    align: 'center',
    key: 'type'
  },
  {
    title: '告警时间',
    key: 'Alarm_time',
    align: 'center',
    dataIndex: 'Alarm_time'
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

const data2 = [
  {
    key: '1',
    color: '09128093812',
    headline: 'PIGOSS告警急需处理',
    type: '已关闭',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    color: '09128093812',
    headline: 'PIGOSS告警急需处理',
    type: '已关闭',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12',
    tags: ['loser']
  },
  {
    key: '3',
    color: '09128093812',
    headline: 'PIGOSS告警急需处理',
    type: '待处理',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12',
    tags: ['cool', 'teacher']
  },
  {
    key: '4',
    color: '09128093812',
    headline: 'PIGOSS告警急需处理',
    type: '分级分类',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12',
    tags: ['cool', 'teacher']
  },
  {
    key: '5',
    color: '09128093812',
    headline: 'PIGOSS告警急需处理',
    type: '已提交',
    IP: '10.23.103.114',
    Alarm_time: '2023-11-12',
    tags: ['cool', 'teacher']
  }
]
export default {
  name: 'TitlePageHome',
  components: {
    titleColor
  },
  data () {
    return {
      value: 'title', // 初始选中的按钮的值
      wrapperCol: {
        xs: { span: 6, offset: 0 },
        md: { span: 12, offset: 0 },
        xl: { span: 11, offset: 1 },
        xxl: { span: 10, offset: 2 }
      },
      menuItems: [
        { route: '/', img: require('./assets/jkjc.png'), label: '监控集成' },
        { route: '/', img: require('./assets/zjgl.png'), label: '主机管理' },
        { route: '/', img: require('./assets/zjgl.png'), label: '虚拟化管理' },
        { route: '/', img: require('./assets/wltp.png'), label: '网络拓扑' },
        { route: '/', img: require('./assets/gjjc.png'), label: '告警集成' },
        { route: '/', img: require('./assets/gjclsz.png'), label: '告警策略设置' },
        { route: '/', img: require('./assets/gjlb.png'), label: '告警列表' },
        { route: '/', img: require('./assets/xgljsz.png'), label: '巡更路径设置' },
        { route: '/', img: require('./assets/xgjhgl.png'), label: '巡更计划管理' },
        { route: '/', img: require('./assets/zcgl.png'), label: '资产管理' }
      ],
      loadingInput: false,
      text_txt: `运维管控平台对资产进行全面的“监控、巡更、告警、处置”自动化平台，助力中交集团基础数字化转型，保障数据中心基础设施服务的高质量发展。<br>
        可视化视图多维度直观展示基础设施监控指标，对告警统一汇聚并抑制去重进行有效告警并处置，对机房资产进行巡更，自动生成巡更报告平台实现运维管理全流程数字化、精细化，同时为未来中交云持续建设夯实了运维保障基础。`,
      data,
      columns,
      data2,
      columns2
    }
  },
  methods: {
    tiaozhuan (path) {
      console.log('path', path)
      // this.$router.push(path)
    },
    onSearch (e) {
      console.log(e)
      this.loadingInput = true
    },
    onChange (e) {
      console.log(e.target.value)
    },
    disposal (e) {
      console.log(e)
    },
    initCharts (eleClass, data) {
      const ele = document.querySelector(eleClass)
      // eslint-disable-next-line no-unused-expressions
      ele !== null ? ele.removeAttribute('_echarts_instance_') : ''

      let myEcharts = null

      myEcharts = echarts.init(ele)

      myEcharts.setOption(data)
    },
    echatsFun () {
      const catogray_option = {
        title: {
          show: false,
          subtext: '资产分布图',
          left: 'center',
          top: '85%',
          subtextStyle: {
            fontFamily: '微软雅黑',
            fontSize: '14',
            fontWeight: 500,
            color: '#0060A3'
          }
        },
        legend: {
          top: 'center',
          orient: 'vertical',
          left: '65%',
          icon: 'circle',
          itemWidth: 10, // 设置图例项的宽度
          itemHeight: 10, // 设置图例项的高度
          itemGap: 20, // 每条数据上下间距
          textStyle: {
            color: '#666',
            fontSize: 12,
            padding: [0, 0, 0, 10]
          },
          formatter: function (name) {
            // 获取对应图例项的值
            let value
            for (let i = 0; i < catogray_option.series.data.length; i++) {
              if (catogray_option.series.data[i].name === name) {
                value = catogray_option.series.data[i].value
                break
              }
            }

            // 返回自定义的图例内容，例如：主机（3948）
            return `${name}（${value}）`
          },
          data: ['主机', '服务器', '防火墙', '网闸', '网关']
        },
        tooltip: {
          show: true,
          trigger: 'item'
          // trigger: 'none'
        },
        grid: {
          top: '10%',
          left: '10%',
          right: '3%'
        },
        series: {
          type: 'pie',
          // startAngle: 180, // 设置起始角度为 45 度
          radius: ['40%', '80%'],
          center: ['30%', '50%'], // 圆的定位
          avoidLabelOverlap: false,
          hoverAnimation: true,
          label: {
            show: false
          },
          labelLine: {
            normal: {
              show: false,
              length: 15,
              length2: 0
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 4, // 设置border的宽度有多大
              borderColor: '#FFFFFF'
            }
          },
          data: [{
            value: 3948,
            name: '主机',
            itemStyle: {
              normal: {
                color: '#3F78F0'
              },
              emphasis: {
                color: '#3F78F0'
              }
            }
          },
          {
            value: 2514,
            name: '服务器',
            itemStyle: {
              normal: {
                color: '#B592E4'
              },
              emphasis: {
                color: '#B592E4'
              }
            }
          },
          {
            value: 1699,
            name: '防火墙',
            itemStyle: {
              normal: {
                color: '#F0B144'
              },
              emphasis: {
                color: '#F0B144'
              }
            }
          },
          {
            value: 1023,
            name: '网闸',
            itemStyle: {
              normal: {
                color: '#FF8745'
              },
              emphasis: {
                color: '#FF8745'
              }
            }
          },
          {
            value: 362,
            name: '网关',
            itemStyle: {
              normal: {
                color: '#F73030'
              },
              emphasis: {
                color: '#F73030'
              }
            }
          }
          ]
        },
        // 配置 graphic，用于显示 "暂无数据"
        graphic: {
          type: 'text',
          left: 'center',
          top: 'middle',
          silent: true,
          invisible: true, // 如果没有数据，则显示文本
          style: {
            fill: '#9d9d9d',
            fontWeight: 'bold',
            text: '暂无数据',
            fontFamily: 'Microsoft YaHei',
            fontSize: '250%'
          }
        }
      }
      this.initCharts('.echartsBox1', catogray_option)
    },
    echatsFun2 () {
      const catogray_option2 = {
        title: {
          show: false,
          subtext: '资产分布图',
          left: 'center',
          top: '85%',
          subtextStyle: {
            fontFamily: '微软雅黑',
            fontSize: '14',
            fontWeight: 500,
            color: '#0060A3'
          }
        },
        legend: {
          top: 'center',
          orient: 'vertical',
          left: '65%',
          icon: 'circle',
          itemWidth: 10, // 设置图例项的宽度
          itemHeight: 10, // 设置图例项的高度
          itemGap: 20,
          textStyle: {
            color: '#666',
            fontSize: 12,
            padding: [0, 0, 0, 10]
          },
          formatter: function (name) {
            // 获取对应图例项的值
            let value
            for (let i = 0; i < catogray_option2.series.data.length; i++) {
              if (catogray_option2.series.data[i].name === name) {
                value = catogray_option2.series.data[i].value
                break
              }
            }

            // 返回自定义的图例内容，例如：主机（3948）
            return `${name}（${value}）`
          },
          data: ['在线资产', '离线资产', '异常资产']
        },
        tooltip: {
          show: true,
          trigger: 'item'
          // trigger: 'none'
        },
        grid: {
          top: '10%',
          left: '10%',
          right: '3%'
        },
        series: {
          type: 'pie',
          // startAngle: 180, // 设置起始角度为 45 度
          radius: ['40%', '80%'],
          center: ['30%', '50%'], // 圆的定位
          avoidLabelOverlap: false,
          hoverAnimation: true,
          label: {
            show: false
          },
          labelLine: {
            normal: {
              show: false,
              length: 15,
              length2: 0
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 4, // 设置border的宽度有多大
              borderColor: '#FFFFFF'
            }
          },
          data: [{
            value: 37247,
            name: '在线资产',
            itemStyle: {
              normal: {
                color: '#3F78F0'
              },
              emphasis: {
                color: '#3F78F0'
              }
            }
          },
          {
            value: 652,
            name: '离线资产',
            itemStyle: {
              normal: {
                color: '#B592E4'
              },
              emphasis: {
                color: '#B592E4'
              }
            }
          },
          {
            value: 2740,
            name: '异常资产',
            itemStyle: {
              normal: {
                color: '#F0B144'
              },
              emphasis: {
                color: '#F0B144'
              }
            }
          }
          ]
        },
        // 配置 graphic，用于显示 "暂无数据"
        graphic: {
          type: 'text',
          left: 'center',
          top: 'middle',
          silent: true,
          invisible: true, // 如果没有数据，则显示文本
          style: {
            fill: '#9d9d9d',
            fontWeight: 'bold',
            text: '暂无数据',
            fontFamily: 'Microsoft YaHei',
            fontSize: '250%'
          }
        }
      }
      this.initCharts('.echartsBox2', catogray_option2)
    }
  },

  mounted () {
    this.echatsFun()
    this.echatsFun2()
    /* try {
      const { data } = await axios.get('/organize/getMyMachine')
      if (data) {
        this.imgUrl = `${process.env.VUE_APP_QUOTE_URL}/view_thumbnail${data}`
      } else {

      }
    } catch (e) {

      throw e
    } */
  }
}
</script>

<style lang="less" scoped>
.shortcut {
  width: 100%;
  height: 180px;
  background: #FFFFFF;
  border-radius: 8px;

  .shortcut_1 {
    //margin-top: 26px;
    //margin-left: 23px;
    padding-top: 26px;
    padding-left: 23px;
    //margin-bottom: 27px;
    height: 66px;
    font-size: 16px;
    //font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 21px;
  }
}

.a-row_1 {
  height: 194px;
  margin-top: 16px;

  .row_1_col_1 {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-right: 8px solid #EFF0F4;
    padding: 22px 0 0 67px;

    .button-container {
      display: flex;
      align-items: center;
    }

    .button-gap {
      width: 20px; /* 设置间隔宽度 */
    }

    .button-container a-radio-button {
      margin-right: 20px; // 设置右侧间隔为20px
    }

    .a-row_1_button {

    }

    .row_1_col_1_input {
      width: 600px;
      border-radius: 4px;
      font-size: 150% !important;
      color: rgb(63, 124, 242);
      margin-top: 15px;
      margin-bottom: 10px;
      //border: 1px solid rgba(151,151,151,0.62);
    }

    /deep/ .ant-input-suffix {
      color: rgb(63, 124, 242) !important;
    }

    /deep/ .ant-badge-status-processing::after {
      border-color: #EFA24F;
    }

    .row_1_col_1_badge {
      height: 28px;
      line-height: 28px;
    }
  }

  .row_1_col_2 {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-left: 8px solid #EFF0F4;
    padding: 26px 29px 0 22px;

    .row_1_col_2_head {
      display: block;
      height: 21px;
      font-size: 16px;
      //font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 21px;
      margin-bottom: 17px;
    }

    .row_1_col_2_text {
      font-size: 12px;
      //font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 26px;
    }

  }

  .ant-radio-button-wrapper {
    margin-right: 10px;
    border-radius: 8px;
    border: 1px solid #B8BBC4;
    //:not(:first-child)::before {
    //  background-color: #FFFFFF !important;
    //}

  }

  .ant-radio-button-wrapper:not(:first-child)::before {
    background-color: transparent;
  }

}

.a-row_2 {
  height: 346px;
  margin-top: 16px;

  .a-row_2_col_left {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-right: 8px solid #EFF0F4;
    padding: 26px 19px 0 23px;
    /deep/ .ant-badge-status-dot{
      width: 13px;
      height: 13px;
    }
    .row_1_col_2_head{
      display: block;
      height: 21px;
      font-size: 16px;
      //font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 21px;
      margin-bottom: 13px;
    }
    /deep/ .ant-table-wrapper{
      padding: 0;
    }
  }

  .a-row_2_col_right {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-right: 8px solid #EFF0F4;
    padding: 26px 19px 0 23px;
    .row_1_col_2_head{
      display: block;
      height: 21px;
      font-size: 16px;
      //font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 21px;
      margin-bottom: 13px;
    }
    /deep/ .ant-table-wrapper{
      padding: 0;
    }
  }
  /deep/ .ant-table-tbody tr:nth-child(2n+1)
  {
    background-color: #F9FBFF; /* 奇数行的背景颜色 */
  }
}

.a-row_3 {
  height: 270px;
  margin-top: 16px;

  .a-row_3_col_left {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-right: 8px solid #EFF0F4;
    padding: 26px 19px 0 23px;
    }
    .row_1_col_3_head{
      display: block;
      height: 21px;
      font-size: 16px;
      //font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 21px;
      //margin-bottom: 13px;
    }

  .a-row_3_col_right {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-right: 8px solid #EFF0F4;
    padding: 26px 19px 0 23px;
    .row_1_col_3_head{
      display: block;
      height: 21px;
      font-size: 16px;
      //font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 21px;
      //margin-bottom: 13px;
    }

  }

}
</style>
