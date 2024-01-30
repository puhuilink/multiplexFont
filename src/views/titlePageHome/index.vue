<template>
  <div style="padding: 0;background: #EFF0F4 ">
    <div class="shortcut">
      <div class="shortcut_1">快捷功能</div>
      <div style="display: flex;padding-left: 15px;overflow-x: scroll; ">
        <div v-for="(item, index) in menuItems" :key="index">
          <a @click="tiaozhuan(item.route)">
            <div class="shell">
              <img v-lazy="thumbnail(item.imgUrl)" src="" class="shell_image" alt=""/>
              <span class="shell_font">{{ item.name }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>

    <a-row class="a-row_1" v-if="cardExistsC001||cardExistsC002">
      <a-col :span="cardExistsC002 ? 12 : 24" class="row_1_col_1" v-if="cardExistsC001" >
        <a-radio-group v-model="value" buttonStyle="solid" @change="onChange">
          <a-radio-button value="title">知识标题</a-radio-button>
          <a-radio-button value="category">知识分类</a-radio-button>
          <a-radio-button value="keyword">关键字</a-radio-button>
          <a-radio-button value="summary">内容摘要</a-radio-button>
          <a-radio-button value="content">知识正文</a-radio-button>
        </a-radio-group><br>
        <a-input-search
          placeholder="请输入您要查找的知识内容"
          class="row_1_col_1_input"
          @search="onSearch"
          size="large"
          :loading="loadingInput"/>
        <div class="badge_box" :style="{ width: cardExistsC002 ? '100%' : '50%' }">
          <a-badge status="processing" color="#EFA24F" text="紧急告警该如何快速有效处置?" class="row_1_col_1_badge"/>
          <a-badge status="processing" color="#EFA24F" text="机房运维发现问题如何处理?" class="row_1_col_1_badge"/>
          <a-badge status="processing" color="#EFA24F" text="统一监控章程是什么??" class="row_1_col_1_badge"/>
          <a-badge status="processing" color="#EFA24F" text="告警处理规?" class="row_1_col_1_badge"/>
          <a-badge status="processing" color="#EFA24F" text="如何快速定位告警源??" class="row_1_col_1_badge"/>
        </div>
      </a-col>
      <a-col :span="cardExistsC001 ? 12 : 24" class="row_1_col_2" v-if="cardExistsC002">
        <span class="row_1_col_2_head">平台简介</span>
        <span v-html="text_txt" class="row_1_col_2_text"></span>
      </a-col>
    </a-row>

    <a-row class="a-row_2" v-if="cardExistsC003||cardExistsC004">
      <a-col :span="cardExistsC004 ? 12 : 24" class="a-row_2_col_left" v-if="cardExistsC003" :style="{ borderRight: cardExistsC004 ? '0.5rem solid #EFF0F4' : 'none' }">
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
      <a-col :span="cardExistsC003 ? 12 : 24" class="a-row_2_col_right" v-if="cardExistsC004" :style="{ borderLeft: cardExistsC003 ? '0.5rem solid #EFF0F4' : 'none' }">
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

    <a-row class="a-row_3" v-if="cardExistsC005||cardExistsC006" :style="{ height: watchEcharts }">
      <a-col :span="12" class="a-row_3_col_left" v-if="cardExistsC005">
        <span class="row_1_col_3_head">资产分布情况</span>
        <div class="echartsBox1" :style="{height: '84%'}" ></div>
      </a-col>
      <a-col :span="12" class="a-row_3_col_right" v-if="cardExistsC006">
        <span class="row_1_col_3_head">资产状态分布图</span>
        <div class="echartsBox2" :style="{height: '84%'}"></div>
      </a-col>
    </a-row>

    <FloatButton :allLinkListMenuCard="allLinkList_menu_card" @custom-event="myLinkListFun" :menuItems="menuItems" :menuItemsCard="menuItemsCard"></FloatButton>
  </div>
</template>

<script>
import img from './assets/zcgl.png'
import FloatButton from './components/FloatButton'
import { axios } from '@/utils/request'
import * as echarts from 'echarts'
import defaultPreviewImg from '@/views/titlePageHome/assets/baobiao.png'
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
    FloatButton
  },
  data () {
    return {
      watchEcharts: '270px',
      value: 'title', // 初始选中的按钮的值
      wrapperCol: {
        xs: { span: 6, offset: 0 },
        md: { span: 12, offset: 0 },
        xl: { span: 11, offset: 1 },
        xxl: { span: 10, offset: 2 }
      },
      menuItems: [
        // { route: '/', imgUrl: 'jkjc.png', name: '监控集成' },
        // { route: '/', imgUrl: 'zjgl.png', name: '主机管理' },
        // { route: '/', imgUrl: 'zidingyi.png', name: '虚拟化管理' },
        // { route: '/', imgUrl: 'wltp.png', name: '网络拓扑' },
        // { route: '/', imgUrl: 'gjjc.png', name: '告警集成' },
        // { route: '/', imgUrl: 'gjclsz.png', name: '告警策略设置' },
        // { route: '/', imgUrl: 'gjlb.png', name: '告警列表' },
        // { route: '/', imgUrl: 'xgljsz.png', name: '巡更路径设置' },
        // { route: '/', imgUrl: 'xgjhgl.png', name: '巡更计划管理' },
        // { route: '/', imgUrl: 'zcgl.png', name: '巡更计划管理' }
      ],
      // 卡片布局未知
      menuItemsCard: [],
      loadingInput: false,
      text_txt: `运维管控平台对资产进行全面的“监控、巡更、告警、处置”自动化平台，助力中交集团基础数字化转型，保障数据中心基础设施服务的高质量发展。<br>
        可视化视图多维度直观展示基础设施监控指标，对告警统一汇聚并抑制去重进行有效告警并处置，对机房资产进行巡更，自动生成巡更报告平台实现运维管理全流程数字化、精细化，同时为未来中交云持续建设夯实了运维保障基础。`,
      data,
      columns,
      data2,
      columns2,
      allLinkList_menu_card: {},

      cardExistsC001: false,
      cardExistsC002: false,
      cardExistsC003: false,
      cardExistsC004: false,
      cardExistsC005: false,
      cardExistsC006: false

    }
  },
  methods: {
    // 刷新
    parentMethod () {
      console.log('试试')
      this.$forceUpdate()
    },
    thumbnail (src) {
      console.log(src)
      return src ? `${process.env.VUE_APP_QUOTE_URL}/view_thumbnail/${src}` : defaultPreviewImg
    },
    tiaozhuan (path) {
      console.log('path', path)
      this.$router.push(path)
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
      myEcharts = echarts.init(ele).setOption(data)
      return myEcharts
      // myEcharts = echarts.init(ele)
      //
      // myEcharts.setOption(data)
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
      // window.addEventListener('resize', () => {
      //   this.initCharts('.echartsBox1', catogray_option).resize()
      // })
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
      // window.addEventListener('resize', () => {
      //   this.initCharts('.echartsBox2', catogray_option2).resize()
      // })
    },
    menuAllLinkList () {
      try {
        // 28.首页—全部快捷功能和卡片
        axios.get('/menu/allLinkList').then(res => {
          // console.log(data)
          if (res.code === 200) {
            this.allLinkList_menu_card = res.data
            // 给menu的childList加上id属性
            this.addIdToChildList(this.allLinkList_menu_card.menu)

            // 给card的childList加上id属性
            // this.addIdToChildList(this.allLinkList_menu_card.card)
            this.allLinkList_menu_card.card.forEach((item, index) => {
              item.id = index + 1
            })
            const newObj = [{
              parentName: '',
              key: '0',
              value: null
            },
            {
              parentName: '全部',
              key: '00',
              value: null,
              childList: []
            }]
            this.allLinkList_menu_card.menu.unshift(...newObj)
            // 整合所有childList数据给,全部按钮
            for (let i = 2; i < this.allLinkList_menu_card.menu.length; i++) {
              this.allLinkList_menu_card.menu[1].childList.push(...this.allLinkList_menu_card.menu[i].childList)
            }
            this.allLinkList_menu_card.menu[1].value = this.allLinkList_menu_card.menu[1].childList.length
          } else {
            this.$notification.error({
              message: '系统提示',
              // description: data.data.description
              description: '网络错误'
            })
          }
        })
      } catch (e) {
        this.allLinkList_menu_card = {
          menu: [// 快捷功能
            {
              parentName: '统一监控',
              childList: [
                {
                  code: 'F004',
                  name: '性能管理',
                  menuType: 1,
                  menuSystem: 1,
                  parentCode: 'F005002',
                  imgUrl: 'jkjc.png'
                },
                {
                  code: 'F005',
                  name: '第三方系统',
                  menuType: 1,
                  menuSystem: 1,
                  parentCode: 'F005002',
                  imgUrl: 'jkjc.png'
                }
              ]
            },
            {
              parentName: '巡更管理',
              childList: [
                {
                  code: 'F010001',
                  name: '巡更配置',
                  menuType: 1,
                  menuSystem: 1,
                  parentCode: 'F005002',
                  imgUrl: 'jkjc.png'
                },
                {
                  code: 'F010002',
                  name: '计划管理',
                  menuType: 1,
                  menuSystem: 1,
                  parentCode: 'F005002',
                  imgUrl: 'jkjc.png'
                }
              ]
            }
          ],
          card: [ // 卡片
            {
              code: 'C001',
              name: '知识库',
              menuType: 10,
              menuSystem: 1,
              parentCode: '',
              imgUrl: 'zhishiku.png'
            },
            {
              code: 'C002',
              name: '平台简介',
              menuType: 10,
              menuSystem: 1,
              parentCode: '',
              imgUrl: 'jianjie.png'
            },
            {
              code: 'C003',
              name: '我的待办',
              menuType: 10,
              menuSystem: 1,
              parentCode: '',
              imgUrl: 'daiban.png'
            },
            {
              code: 'C004',
              name: '我的申请',
              menuType: 10,
              menuSystem: 1,
              parentCode: '',
              imgUrl: 'shenqing.png'
            },
            {
              code: 'C005',
              name: '资产类型分布',
              menuType: 10,
              menuSystem: 1,
              parentCode: '',
              imgUrl: 'zclx.png'
            },
            {
              code: 'C006',
              name: '资产状态分布',
              menuType: 10,
              menuSystem: 1,
              parentCode: '',
              imgUrl: 'zczt.png'
            }
          ]
        }
        // 给menu的childList加上id属性
        this.addIdToChildList(this.allLinkList_menu_card.menu)

        // 给card的childList加上id属性
        // this.addIdToChildList(this.allLinkList_menu_card.card)
        this.allLinkList_menu_card.card.forEach((item, index) => {
          item.id = index + 1
        })
        const newObj = [{
          parentName: '',
          key: '0',
          value: null
        },
        {
          parentName: '全部',
          key: '00',
          value: null,
          childList: []
        }]
        this.allLinkList_menu_card.menu.unshift(...newObj)
        // 整合所有childList数据给,全部按钮
        for (let i = 2; i < this.allLinkList_menu_card.menu.length; i++) {
          this.allLinkList_menu_card.menu[1].childList.push(...this.allLinkList_menu_card.menu[i].childList)
        }
        this.allLinkList_menu_card.menu[1].value = this.allLinkList_menu_card.menu[1].childList.length
      } finally {

      }
    },
    myLinkListFun () {
      try {
        // 29.首页—我的快捷功能和卡片
        axios.get('/menu/myLinkList').then(res => {
          // console.log(data)
          if (res.code === 200) {
            this.menuItems = res.data.menu
            this.menuItemsCard = res.data.card // 卡片掉布局
            const codearr = ['C001', 'C002', 'C003', 'C004', 'C005', 'C006']
            // 重置数据,下方判断只变为true,不会变为false
            this.cardExistsC001 = false
            this.cardExistsC002 = false
            this.cardExistsC003 = false
            this.cardExistsC004 = false
            this.cardExistsC005 = false
            this.cardExistsC006 = false
            for (const re of this.menuItemsCard) {
              for (const reElement of codearr) {
                if (re.code === reElement) {
                  // console.log(`cardExists${reElement}`, this[`cardExists${reElement}`])
                  this[`cardExists${reElement}`] = true
                }
              }
            }
            // this.cardExistsC001 = false
            // this.cardExistsC002 = false
            // this.cardExistsC003 = true
            // this.cardExistsC004 = false
            // this.cardExistsC005 = true
            // this.cardExistsC006 = true

            this.watchEcharts = (!(this.cardExistsC001 && this.cardExistsC002) || !(this.cardExistsC003 && this.cardExistsC004)) ? '390px' : '270px'
            if (this.cardExistsC005 === true) {
              this.$nextTick(() => {
                this.echatsFun()
              })
            }
            if (this.cardExistsC006 === true) {
              this.$nextTick(() => {
                this.echatsFun2()
              })
            }
          } else {
            this.$notification.error({
              message: '系统提示',
              // description: data.data.description
              description: '网络错误'
            })
          }
        })
      } catch (e) {

      } finally {}
    },
    addIdToChildList (arr) {
      arr.forEach((item, index) => {
        item.key = index + 1
        item.value = item.childList.length
        item.childList.forEach((childItem, childIndex) => {
          childItem.id = index * 10 + childIndex + 1
          // childItem.imgUrl = require(childItem.imgUrl)
        })
      })
    }
  },
  // watch: {
  //   watchEcharts: {
  //     handler (newVal, oldVal) {
  //       // 在 watchEcharts 变化时执行
  //       this.$nextTick(() => {
  //         this.echatsFun()
  //         this.echatsFun2()
  //       })
  //     }
  //     // deep: true, // 如果 watchEcharts 是对象或数组，需要加上 deep: true
  //     // immediate: true // 立即执行一次，监听初始化时的值变化
  //   }
  // },

  created: async function () {
    await this.menuAllLinkList()
    await this.myLinkListFun()
  },
  async mounted () {
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
.shell {
  height: 97px;
  //width: 104px;
  margin: 0 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: nowrap; /* 禁止换行 */
  img{
    width: 58px;
    height: 58px;
    //background: #3F78F0;
    //border-radius: 8px;
  }
  .shell_font{
    margin-top: 18px;
    height: 21px;
    font-size: 16px;
    //font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 21px;
  }
}
.shortcut {
  width: 100%;
  height: 180px;
  background: #FFFFFF;
  border-radius: 8px;
  font-family: 'MicrosoftYaHei';
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
    font-family: 'MicrosoftYaHei';
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
    .badge_box{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(33%, 1fr));
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
      /deep/ .ant-badge-status-text{
        font-size: 12px;
      }
    }
  }

  .row_1_col_2 {
    height: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    border-left: 8px solid #EFF0F4;
    padding: 26px 29px 0 22px;
    font-family: 'MicrosoftYaHei';
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
    border-left: 8px solid #EFF0F4;
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
    border-left: 8px solid #EFF0F4;
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
