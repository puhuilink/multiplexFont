<template>
  <div class="topbigBox">
    <!-- 下拉 -->
    <div style="margin-left: 37px">
      <a-select
        show-search
        placeholder="请选择组织单位"
        option-filter-prop="children"
        style="width: 300px"
        :filter-option="filterOption"
        @change="handleChange"
        v-model="selectedOrganize">
        <a-select-option :value="item.organizeId" v-for="(item, index) in list" :key="index">
          {{ item.organizeName }}
        </a-select-option>
      </a-select>
    </div>

    <!--  -->
    <a-spin :spinning="loading">
      <div class="bigflexBox">
        <div class="EacherLeft">
          <div class="TextEacherbox1">综合风险趋势</div>
          <div ref="eacherbox1" class="eacherBox echarts"></div>
        </div>
        <div class="EacherRight">
          <div class="TextEacherbox1">未处置完成的告警</div>
          <div class="twoEacherBox">
            <div ref="eacherbox21" class="eacherBox echarts"></div>
            <div class="eacherBoxfu">
              <div class="textTime">
                <div class="textTime_1">时间范围</div>
                <!-- <div class="textTime_2">
                <div @click="openDateTimePicker('start')" class="startTimeBOX">{{ startTime }}</div>
                <div class="start_end">-</div>
                <div @click="openDateTimePicker('end')" class="endTimeBOX">{{ endTime }}</div>
              </div> -->
                <a-range-picker
                  size="small"
                  :disabled-date="disabledDate"
                  :disabled-time="disabledRangeTime"
                  :show-time="{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 330px" />
              </div>
              <div ref="eacherbox22" class="eacherBox echarts" id="eacherBoxid"></div>
            </div>
          </div>
        </div>
        <div class="EacherBottonLeft">
          <div class="TextEacherbox1">最近7天告警危害等级分布</div>
          <div ref="eacherbox3" class="eacherBox echarts"></div>
        </div>
        <div class="EacherBottonLeft">
          <div class="TextEacherbox1">最近7天威胁类型统计</div>
          <div ref="eacherbox4" class="eacherBox echarts"></div>
        </div>
      </div>
    </a-spin>

  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import axios from 'axios'
import _ from 'lodash'
// import { over } from '@/utils/request'
export default {
  name: 'SecondaryUnits',
  components: {
    // 'mt-datetime-picker': DatetimePicker,
  },
  data () {
    return {
      loading: false,
      selectedOrganize: '',
      list: [],
      listData1: [],
      listTime1: [],
      listData2: [],
      listData22: [],
      listData3: [],
      listData4: []
    }
  },

  mounted () {
    // if (this.list.length > 0) {
    //   this.searchValue = this.list[0].label
    // }
    this.gettime()
    // this.drawPolicitalStatus()
    // this.drawPolicitalStatus2()
    this.drawPolicitalStatus22()
    this.drawPolicitalStatus3()
    this.drawPolicitalStatus4()
    this.ngsocGet()
    // this.$nextTick()
    // this.getNowTime(); //获取现在时间
  },

  watch: {},
  // computed: {
  //   selectedOrganize() {
  //     console.log('this.list', this.list,);
  //     return _.get(this.list, '0.organizeId', '')
  //   }
  // },
  methods: {
    async ngsocGet () {
      this.loading = true
      // const res = await axios.get(`/ngsoc/get`)
      // this.list = res.data
      this.list = [{
        'organizeId': '74',
        'overviewToken': 'dc722c526d4060061ab12bee19255bd0a794aeb31d1581b3e8a15760162788b0xxxx',
        'dashboardToken': '354dea93adb52316dce58a56eaba47360f852f0eb9631628b29e73b3a390e45yyyy',
        'organizeName': '公规院',
        'parentId': '1',
        'root': false
      }, {
        'organizeId': '75',
        'overviewToken': 'dc722c526d4060061ab12bee19255bd0a794aeb31d1581b3e8a15760162788b0aaaa',
        'dashboardToken': '354dea93adb52316dce58a56eaba47360f852f0eb9631628b29e73b3a390e45bbbb',
        'organizeName': '一公局',
        'parentId': '1',
        'root': false
      }]
      if (this.list.length > 0) {
        // console.log(this.list);
        this.selectedOrganize = this.list[0].organizeId
        // console.log(this.selectedOrganize);
        this.handleChange(this.selectedOrganize)
      }
    },
    // 下拉菜单
    handleChange (value) {
      console.log(`selected ${value}`)
      // 根据valu查找list的单位
      const foundData = this.list.find(item => item.organizeId === value)
      // console.log(foundData)
      this.customviewQuery(foundData)
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async customviewQuery (foundData) {
      const instance = axios.create({
        baseURL: process.env.VUE_APP_XUNJIAN_API_BASE_URL,
        headers: {
          'Content-Type': 'application/json'
          // "NGSOC-Access-Token": `${foundData.overviewToken}`
        },
        params: {
          token: '105474a6a3ba5181196c1c2dc723f3e0b8fbc732edbdfa0fb8ee69348fa7bfd2'
        }
      })
      // console.log(instance());
      // 1.综合风险趋势
      // const comprehensive = await instance.get('/overviews/comprehensive-risk-trend')
      const comprehensive = await instance.get('/ngsoc/depart/comprehensive-risk-trend')

      const comprehensiveData = comprehensive.data.data
      // 2.未处置完成的告警
      // const alarm = await instance.get('/overviews/alarm-stat')
      const alarm = await instance.get('/ngsoc/depart/alarm-stat')

      // 到这给第一个图表数据
      const echartsData = comprehensiveData.map(item => {
        // console.log(item);
        item.time = this.formatTimestamp(parseInt(item.time))
        this.listData1.push(item.risk)
        this.listTime1.push(item.time)
        return item
      })
      this.drawPolicitalStatus()
      // this.datatime=listTime1
      // this.datatime=listData1

      this.listData2 = alarm.data.data.alarmSeverityGroupStat
      this.drawPolicitalStatus2()
      this.listData22 = [alarm.data.data.outAttackAlarm,
        alarm.data.data.movementAlarm,
        alarm.data.data.assetOutreachAlarm,
        alarm.data.data.iocAlarm,
        alarm.data.data.maliciousFileAlarm]
      this.drawPolicitalStatus22()
      // 3.最近7天告警危害等级分布/
      const Last7Alarm = await instance.get('/ngsoc/depart/severity')
      console.log('告警危害等级分布', Last7Alarm)
      if (Last7Alarm.data.code === 200) {
        this.listData3 = Last7Alarm.data
        this.drawPolicitalStatus3()
      }
      // 4.最近7天威胁类型统计
      const Last7Threat = await instance.get('/ngsoc/depart/category')
      if (Last7Threat.data.code === 200) {
        this.listData4 = Last7Threat.data
        this.drawPolicitalStatus4()
      }
      console.log('威胁类型统计', Last7Threat)
      this.loading = false

      // 到这给图标赋值
      // this.=res.data
    },
    // 转换时间格式
    formatTimestamp (timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    // -----------------------------
    gettime () {
      // 获取当前日期
      const currentDate = new Date()

      // 获取年、月、日
      const year = currentDate.getFullYear()
      // const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      // const day = String(currentDate.getDate()).padStart(2, '0')

      // 生成日期数组
      const data = []
      for (let i = 0; i < 5; i++) {
        const date = new Date(year, currentDate.getMonth(), currentDate.getDate() - (9 - i))
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`
        data.push(formattedDate)
      }
      // this.datatime = data
      // console.log(this.datatime);
    },

    drawPolicitalStatus () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.eacherbox1)
      const listTime1 = this.listTime1
      const listData1 = this.listData1
      // 绘制图表
      myChart.setOption({
        color: ['#ff974c', '#00eaff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: 'rgb(126,199,255)'
            }
          }
        },
        legend: {
          show: false
          // top: '2%',
          // icon: 'roundRect',
          // itemWidth: 30, // 图例标记的图形宽度。
          // itemHeight: 2, //  图例标记的图形高度。
          // textStyle: {
          //   color: '#fff',
          //   fontSize: 14,
          //   padding: [0, 8, 0, 8],
          // },
        },
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '15%'
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              // 坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: 'rgb(41,188,245)'
              }
            },
            axisLabel: {
              // 坐标轴刻度标签的相关设置
              margin: 13.5,
              textStyle: {
                color: '#81BAE5',
                fontSize: 12
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#233653'
              }
            },
            axisTick: {
              show: false
            },
            data: listTime1
          }
        ],
        yAxis: [
          {
            name: '',
            nameTextStyle: {
              color: '#81BAE5',
              fontSize: 12,
              padding: [0, 60, 0, 0]
            },
            // minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#1160a0',
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#81BAE5',
                fonFamily: 'ArialMT',
                fontSize: 12
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#81BAE5',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '基准情景值',
            type: 'line',

            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            lineStyle: {
              normal: {
                width: 2,
                color: '#ff974c' // 线条颜色
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  color: '#fff',
                  position: 'top', // 在上方显示
                  formatter: function (res) {
                    if (res.value) {
                      return res.value
                    } else {
                      return 0
                    }
                  }
                }
              }
            },
            symbolSize: 0, // 设定实心点的大小
            areaStyle: {
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#ff974c30'
                    },
                    {
                      offset: 0.6,
                      color: '#ff974c20'
                    },
                    {
                      offset: 1,
                      color: '#ff974c10'
                    }
                  ],
                  false
                )
              }
            },
            data: listData1
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 未处置---------------
    drawPolicitalStatus2 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart2 = echarts.init(this.$refs.eacherbox21)
      const data = [
        {
          value: this.listData2[3].alarmCount,
          name: '危急',
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
          value: this.listData2[2].alarmCount,
          name: '高危',
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
          value: this.listData2[1].alarmCount,
          name: '中危',
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
          value: this.listData2[0].alarmCount,
          name: '低危',
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
      myChart2.setOption({
        title: {
          text: 612,
          subtext: '总数',
          left: 'center',
          top: '30%',
          textStyle: {
            color: '#000000',
            fontSize: 24,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: '400'
          },
          subtextStyle: {
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontSize: 14,
            color: '#000'
          }
        },
        tooltip: {
          // 下面的图标加文字
          show: true,
          trigger: 'item'
          // trigger: 'none'
        },
        legend: [
          {
            left: '20%',
            bottom: '10%',
            icon: 'circle',
            itemWidth: 20,
            itemGap: 15,
            orient: 'vertical',
            textStyle: {
              fontSize: 15,
              color: 'rgba(0,0,0,0.7)'
            },
            // left: 'center',
            selectedMode: false,
            formatter: function (name) {
              let value = 0
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === name) {
                  value = data[i].value
                  break
                }
              }

              return name + ' ' + value // 添加间距
            },
            textAlign: 'left', // 文本水平居中对齐
            data: [{ name: '低危' }, { name: '高危' }],
            width: 160
          },
          {
            left: '52%',
            bottom: '10%',
            icon: 'circle',
            itemWidth: 20,
            itemGap: 15,
            orient: 'vertical',
            textStyle: {
              fontSize: 15,
              color: 'rgba(0,0,0,0.7)'
            },
            // left: 'center',
            selectedMode: false,
            formatter: function (name) {
              let value = 0
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === name) {
                  value = data[i].value
                  break
                }
              }

              return name + ' ' + value // 添加间距
            },
            textAlign: 'left', // 文本水平居中对齐
            data: [{ name: '中危' }, { name: '危急' }],
            width: 160
          }
        ],
        series: [
          // 我是圆环
          {
            type: 'pie',
            top: '0',
            botton: '0',
            center: ['50%', '40%'],
            radius: ['30%', '55%'],
            //  roseType:10,
            itemStyle: {
              borderWidth: 3,
              borderColor: '#fff'
            },
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart2.resize()
      })
    },
    // ---时间选择区间
    moment,
    range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },

    disabledDate (current) {
      // Can not select days before today and today
      return current && current >= moment().endOf('day')
    },

    disabledRangeTime (_, type) {
      if (type === 'start') {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56]
        }
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56]
      }
    },

    // 处理时间数据格式为2021.01.01 00:00:00
    timeformat (mytime) {
      const originalDate = new Date(mytime)

      const formattedDate = `${originalDate.getFullYear()}.${(originalDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${originalDate.getDate().toString().padStart(2, '0')} ${originalDate
        .getHours()
        .toString()
        .padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate
        .getSeconds()
        .toString()
        .padStart(2, '0')}`

      // console.log(formattedDate); // 输出: 2021.01.01 00:00:00

      return formattedDate
    },
    // 获取最近五天时间
    getNowTime () {
      const now = new Date()
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 通过减去相应的毫秒数来获得五天前的日期
      this.startTime = this.timeformat(fiveDaysAgo)
      this.endTime = this.timeformat(now)
    },

    // 未处置---------------
    drawPolicitalStatus22 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart22 = echarts.init(this.$refs.eacherbox22)
      const nameData = ['外部攻击告警', '横向移动告警', '资产外外连告警', '命中威胁告警', '恶意文件告警'] // 年份
      // [outAttackAlarm,movementAlarm,assetOutreachAlarm,iocAlarm,maliciousFileAlarm]

      const threatLevels = ['危急', '高危', '中危', '低危']

      const threatData = threatLevels.map(threatLevel => {
        return Object.keys(this.listData22).reduce((acc, alarmType) => {
          const threatLevelData = this.listData22[alarmType].alarmSeverityGroupStat.find(item => item.severityString === threatLevel)
          acc.push(threatLevelData ? threatLevelData.alarmCount : 0)
          return acc
        }, [])
      })

      console.log(threatData)
      /*  const data1Arr = [80, 70, 21, 85, 0] // "危急"
       const data2Arr = [30, 70, 51, 85, 0] // "高危"
       const data3Arr = [20, 90, 42, 50, 0] // "中危"
       const data4Arr = [20, 70, 31, 85, 0] // "低危" */
      const data1Arr = threatData[0]// "危急"
      const data2Arr = threatData[1] // "高危"
      const data3Arr = threatData[2] // "中危"
      const data4Arr = threatData[3] // "低危"

      // var defaultData = [500, 500, 500, 500, 500]
      // var defaultData=[]
      // console.log(this.listData22);
      // this.listData22.forEach(el => {
      //   console.log(el);
      //   defaultData.push(el.total)
      // });
      // console.log(defaultData);
      // const dataName = ['2017-2018-1', '2017-2018-2',]; // 类型
      /* 整合 */
      const dataList = [data1Arr, data2Arr, data3Arr, data4Arr]
      const colorList = ['#DC5656', '#FFA044', '#EAE174', '#3CA6FF', '#002F54']
      const seriesList = []
      for (let index = 0; index < nameData.length; index++) {
        seriesList.push({
          // name: dataName[0] + '-' + dataName[1],
          stack: 'bar',
          itemStyle: {
            normal: {
              color: colorList[index]
            },
            emphasis: {
              color: colorList[index]
            }
          },

          type: 'bar',
          barWidth: '12', // 柱型宽度
          data: dataList[index],
          emphasis: {
            focus: 'series'
          },
          showBackground: true,
          /*   backgroundStyle: {单个柱形图背景色
              normal: {
                color: '#000',
              }
          }, */

          label: {
            show: false, // 图上的数据(例如柱形图最上面的展示数据)
            position: 'right',
            color: '#A0AEC0',
            fontFamily: 'HarmonyOS Sans-Regular'
          }
        })
      }

      const option = {
        tooltip: {
          trigger: 'axis', // 悬停
          // trigger: 'item',//点击
          // triggerOn: 'click',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            const dataName = params[0].name
            let tooltipContent = dataName + ':'
            // 拼接每个数据系列对应的具体数值和颜色
            params.forEach((param) => {
              const value = param.value
              const color = param.color
              // 排除背景数据值 500
              if (value !== 500) {
                // 使用 icon 标签显示颜色图标
                tooltipContent += ` <span style="display:inline-block;margin-left:5px;width:10px;height:10px;background-color:${color};border-radius:50%"></span>&nbsp&nbsp${value} `
              }
            })
            // 返回自定义的提示框内容
            return tooltipContent
          },
          position: function (point, params, dom, rect, size) {
            // 提示框位置
            const x = -size.contentSize[0]
            let y = 0
            // 提示框定位
            /* if (point[0] + size.contentSize[0] < size.viewSize[0]) {
              x = point[0];
            }  else {
              x = -size.contentSize[0]
            } */
            if (point[1] > size.contentSize[1]) {
              y = point[1] - size.contentSize[1]
            } /*  else if (point[1] + size.contentSize[1] < size.viewSize[1]) {
              y = point[1];
            } else {
              y = '30%';
            } */
            return [x, y]
          },
          textStyle: {
            color: '#fff',
            fontFamily: 'Source Han Sans CN-Regular'
          },
          extraCssText:
            'opacity: 0.8;background-color:#050F1B;padding:16px;box-shadow: 1px 6px 15px 1px rgba(0,0,0,0.13);border-radius: 4px;filter: blur(undefinedpx);border:none;'
        },

        grid: {
          left: '0',
          right: '37',
          bottom: '0%', // 下边距,
          top: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
              // color: '#000000',
              // fontSize: 12,
              // fontFamily: 'HarmonyOS Sans-Regular',
            },
            splitLine: {
              show: false
              // lineStyle: {
              //   color: 'rgba(255,255,255,0.09)',
              // },
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            /* axisLabel: {
              color: '#81BAE5',
              fontSize: 12,
              fontFamily: 'PingFangSC-Semibold, PingFang SC'
            }, */
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: nameData,
            axisLabel: {
              inside: true,
              align: 'left',
              verticalAlign: 'bottom',
              padding: [0, 0, 12, -8],
              textStyle: {
                color: '#81BAE5',
                fontSize: '12',
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fonWeight: 600
              }
            }
          }
        ],

        series: seriesList.map((item) => {
          return {
            ...item
          }
        })
      }

      const optionWithData = []
      nameData.forEach((name, index) => {
        optionWithData.push(option.series[index])
        optionWithData.push(name)
        /*  optionWithData.push({
           name: '背景',
           type: 'bar',
           barWidth: 12,
           barGap: '-100%', // 重合柱形图
           z: -1, // 设置背景条形图的层叠顺序，使其在数据条形图下层显示
           data: defaultData,
           itemStyle: {
             normal: {
               color: '#002F54'
               // barBorderRadius: 1,
             }
           }
         }) */
      })

      myChart22.setOption({
        backgroundColor: option.backgroundColor,
        tooltip: option.tooltip,
        // legend: option.legend,
        grid: option.grid,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        series: optionWithData
      })
      window.addEventListener('resize', function () {
        myChart22.resize()
      })
    },
    // 最近7天告警危害等级分布
    drawPolicitalStatus3 () {
      const severity1 = []
      let severity1Total = 0
      const severity2 = []
      let severity2Total = 0
      const severity3 = []
      let severity3Total = 0
      const severity4 = []
      let severity4Total = 0
      const severityTime = []
      try {
        if (this.listData3.data.data.length > 0) {
          this.listData3.data.data.map(item => {
            switch (item.severity) {
              case 1:
                severity1.push(item['count(severity)'])
                severity1Total += item['count(severity)']
                break
              case 2:
                severity2.push(item['count(severity)'])
                severity2Total += item['count(severity)']
                break
              case 3:
                severity3.push(item['count(severity)'])
                severity3Total += item['count(severity)']
                break
              case 4:
                severity4.push(item['count(severity)'])
                severity4Total += item['count(severity)']
                break
              default:
                break
            }
            // 检查并添加唯一的时间戳值
            if (!severityTime.includes(item['timestamp@day'])) {
              severityTime.push(item['timestamp@day'])
            }
          })
        }
      } catch (error) {

      }

      // 基于准备好的dom，初始化echarts实例
      const myChart3 = echarts.init(this.$refs.eacherbox3)
      const data = [
        {
          value: severity4Total,
          name: '危急',
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
          value: severity3Total,
          name: '高危',
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
          value: severity2Total,
          name: '中危',
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
          value: severity1Total,
          name: '低危',
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
      // 绘制图表
      myChart3.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // 整体图形
          left: '37',
          right: '10',
          bottom: '5%',
          top: '20%',
          containLabel: true
        },
        // legend: {
        //   left: 'center',
        //   top: '5%',
        //   textStyle: {
        //     color: '#fff',
        //   },
        //   itemWidth: 15,
        //   itemHeight: 10,
        //   itemGap: 25,
        // },
        legend: {
          // 上面的点
          top: '6%',
          left: 140,
          // align: 'center', // 将图例水平居中
          // left:37,
          icon: 'circle',
          textStyle: {
            fontSize: 12, // 字体大小
            color: '#81BAE5' // 字体颜色
          },
          itemWidth: 25,
          itemGap: 20, // 设置数据之间的间距为 10px
          selectedMode: false,
          formatter: function (name) {
            let value = 0
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                value = data[i].value
                break
              }
            }

            return name + ' ' + value // 添加间距
          },
          data: ['危急', '高危', '中危', '低危']
        },

        dataZoom: [
          {
            show: false,
            // height: 10,
            xAxisIndex: [0],
            bottom: 6,
            start: 0,
            end: 100,
            // handleIcon:
            // 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '100%',
            handleStyle: {
              color: 'rgba(255, 255, 255,0.5)'
            },
            textStyle: {
              color: '#fff',
              fontSize: 10
            },
            fillerColor: 'rgba(42, 131, 223,1)',
            borderColor: 'rgba(66, 130, 197,1)',
            backgroundColor: 'rgba(12, 67, 124,0.5)',
            showDataShadow: false,
            brushSelect: false
          },
          {
            type: 'inside',
            disabled: false
          }
        ],
        xAxis: {
          show: true,
          type: 'category',
          name: '',
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 12
          },
          inverse: false,
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '',
              width: 1
            }
          },
          axisTick: {
            show: false
            // alignWithLabel: false,
            // interval: 'auto',
            // inside: false,
            // length: 5,
            // lineStyle: {
            //   type: 'solid',
            //   width: 1,
            //   color: 'rgba(28, 158, 222, 1)',
            // },
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              width: 1,
              color: '#3B6F9F'
            }
          },
          axisLabel: {
            // x轴和下面的文字间距
            margin: 13.5,
            interval: 'auto',
            rotate: 0,
            fontSize: 12,
            color: '#81BAE5'
          },
          data: severityTime
        },
        yAxis: [
          {
            show: true,
            type: 'value',
            name: '',
            min: 0, // y轴数据最小
            nameTextStyle: {
              color: 'rgba(255,255,255,0.7)'
            },
            axisLine: {
              // y轴样式
              show: false
              // lineStyle: {
              //   color: 'rgba(28, 158, 222, 1)',
              // },
            },
            // axisTick: {
            //   show: true,
            // },
            axisLabel: {
              // 刻度标签
              formatter: '{value}',
              rotate: 0,
              textStyle: {
                color: 'rgba(28, 158, 222, 1)'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: 'rgba(0, 206, 209, 0.1)'
              }
            }
          }
        ],
        series: [
          {
            name: '危急',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#DC5656'
              }
            },
            /*  label: {
              show: true,
              rotate: 0,
              color: '#29acff',
              position: 'top',
              fontSize: 12,
            }, */
            label: {
              normal: {
                show: false
                // fontSize: 13,
                // color: '#14B6F3',
                // position: 'top',
              }
            },
            data: severity4
          },
          {
            name: '高危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#FFA044'
              }
            },
            label: {
              // 柱子上的文字
              show: false
            },
            data: severity3
          },
          {
            name: '中危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#EAE174'
              }
            },
            label: {
              show: false
            },
            data: severity2
          },
          {
            name: '低危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#3CA6FF'
              }
            },
            label: {
              show: false
            },
            data: severity1
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart3.resize()
      })
    },
    // 最近7天威胁类型统计
    drawPolicitalStatus4 () {
      const rule_category_id = []
      const ruleName = []
      const severityTime = []
      let resultArray
      try {
        console.log(this.listData4.data.data)
        if (this.listData4.data.data.length > 0) {
          // 创建一个空对象，用于存储每个rule_category_id对应的count(rule_category_id)值的数组
          const result = {}

          // 遍历原始数据
          this.listData4.data.data.forEach(item => {
            const ruleCategoryId = item['rule_category_id']
            const countValue = item['count(rule_category_id)']

            // 如果rule_category_id已经在result对象中，将countValue添加到相应的数组中
            if (result.hasOwnProperty(ruleCategoryId)) {
              result[ruleCategoryId].count_values.push(countValue)
            } else {
              // 否则，创建一个新对象并添加count_values数组
              result[ruleCategoryId] = {
                rule_category_id: ruleCategoryId,
                count_values: [countValue]
              }
            }

            // 时间戳值
            if (!severityTime.includes(item['timestamp@day'])) {
              severityTime.push(item['timestamp@day'])
            }
            // 名字

            if (!rule_category_id.includes(item['rule_category_id'])) {
              rule_category_id.push(item['rule_category_id'])
              this.listData4.data.dynamic[0].searchValueInfo.map(info => {
                if (info.esValueName === item['rule_category_id']) {
                  ruleName.push(info['chValueName'])
                }
              })
            }
          })
          console.log(result)
          // 将结果转换为数组形式
          // 计算每个对象中count_values数组的和，并添加到对象中
          Object.values(result).forEach(item => {
            const sum = item.count_values.reduce((total, count) => total + count, 0)
            item.total_count = sum
          })
          resultArray = Object.values(result)

          console.log(resultArray, severityTime, ruleName)
        }
      } catch (error) {

      }
      if (ruleName.length <= 0) {
        return
      }
      // 基于准备好的dom，初始化echarts实例
      const myChart4 = echarts.init(this.$refs.eacherbox4)
      const dataList = [
        {
          value: resultArray[0].total_count,
          name: ruleName[0],
          itemStyle: {
            normal: {
              color: '#3CA6FF'
            },
            emphasis: {
              color: '#3CA6FF'
            }
          }
        },
        {
          value: resultArray[1].total_count,
          name: ruleName[1],
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
          value: resultArray[2].total_count,
          name: ruleName[2],
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
          value: resultArray[3].total_count,
          name: ruleName[3],
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
          value: resultArray[4].total_count,
          name: ruleName[4],
          itemStyle: {
            normal: {
              color: '#BF78C5'
            },
            emphasis: {
              color: '#BF78C5'
            }
          }
        }
      ]
      // 绘制图表
      myChart4.setOption({
        tooltip: {
          trigger: 'axis'
        },

        legend: {
          // 上面的点
          top: '6%',
          left: 100,

          icon: 'circle',
          textStyle: {
            fontSize: 12, // 字体大小
            color: '#81BAE5' // 字体颜色
          },
          itemWidth: 25,
          selectedMode: false,
          formatter: function (name) {
            let value = 0
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].name === name) {
                value = dataList[i].value
                break
              }
            }

            return name + ' ' + value // 添加间距
          },
          data: ruleName
          // width: 160,
        },
        grid: {
          left: '37',
          right: '37',
          bottom: '5%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // boundaryGap: true,
          name: '',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3B6F9F'
            }
          },
          axisLabel: {
            // 文字于x轴间距
            margin: 13.5,
            fontFamily: 'ArialMT',
            color: '#81BAE5',
            lineHeight: 12
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },

          data: severityTime
        },
        yAxis: {
          type: 'value',
          name: '',
          axisLabel: {
            fontFamily: 'ArialMT',
            color: '#81BAE5',
            lineHeight: 12
          },

          axisLine: {
            show: false // 关闭x轴线
          },

          splitLine: {
            show: true,
            lineStyle: {
              color: '#f0f0f0',
              type: 'dotted'
            }
          },
          nameTextStyle: {
            show: false,
            color: 'white',
            fontSize: 12,
            fontWeight: 600
          }
        },
        series: [
          {
            name: ruleName[0],
            type: 'line',
            data: resultArray[0].count_values,
            smooth: true, // 平滑曲线
            itemStyle: {
              normal: {
                // #ff0066
                color: '#3CA6FF',
                borderColor: '#3CA6FF',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: null, // 实心圆,圆环emptyCircle
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: ruleName[1],
            type: 'line',
            data: resultArray[1].count_values,
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#EAE174',
                borderColor: '#EAE174',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: ruleName[2],
            type: 'line',
            data: resultArray[2].count_values,
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#DC5656',
                borderColor: '#DC5656',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: ruleName[3],
            type: 'line',
            data: resultArray[3].count_values,
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#FFA044',
                borderColor: '#FFA044',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: ruleName[4],
            type: 'line',
            data: resultArray[4].count_values,
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#BF78C5',
                borderColor: '#BF78C5',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart4.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .topbigBox {
//   // height: 660.8px;
//   // margin-top: 20px;
// }

.bigflexBox {
  width: 100%;
  // height: 612px;
  // overflow: hidden;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;

  .TextEacherbox1 {
    // width: 88px;
    height: 18px;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #5bbbff;
    line-height: 18px;
    // padding-left: 37px;
    margin-left: 37px;
  }

  .EacherLeft {
    width: 50%;
    height: 278px;

    .eacherBox {
      height: 260px;
    }
  }

  .EacherRight {
    width: 50%;
    height: 278px;
  }

  .twoEacherBox {
    display: flex;
    width: 100%;
    // height: 260px;

    .eacherBox {
      //  flex-basis: 25%;
      width: 310px;
    }

    .eacherBoxfu {
      width: 330px;
    }

    .textTime {
      // width: 100px;
      height: 38px;

      .textTime_1 {
        font-size: 12px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #81bae5;
        line-height: 12px;
      }

      /* .textTime_2 {
        width: 288px;
        height: 22px;
        // box-sizing: border-box;
        border: 1px solid #2c5882;
        margin-top: 4px;
        display: flex;
        text-align: center;
        .startTimeBOX,
        .endTimeBOX,
        .start_end {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 22px;
        }
        .startTimeBOX {
          margin-left: 6.5px;
        }
        .start_end {
          margin: 0 8px;
        }
      } */
    }
  }
}

// .eacherBox {
//   flex-basis: 50%;
//   // height: 200px;
//   // text-align: center;
// }
#eacherBoxid {
  height: 215px;
  width: 330px;
}

.echarts {
  // height: 200px;
  width: 640px;
}

.EacherBottonLeft {
  // display: flex;
  margin-top: 20px;
  width: 50%;

  .eacherBox {
    height: 278px;
  }
}
</style>
