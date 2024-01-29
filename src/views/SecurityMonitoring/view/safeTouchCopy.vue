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
                时间范围：<div style="font-weight: 500">{{ listData22StartTime }}-{{ listData22EndTime }}</div>
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
import ajax from 'axios'
import { axios } from '@/utils/request'
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
      listData4: [],
      listData22EndTime: '0-0-0-0 0:0:0',
      listData22StartTime: '0-0-0-0 0:0:0',
      iocAlarm_total: null,
      outAttackAlarm_total: null,
      movementAlarm_total: null,
      assetOutreachAlarm_total: null,
      maliciousFileAlarm_total: null
    }
  },

  mounted () {
    // if (this.list.length > 0) {
    //   this.searchValue = this.list[0].label
    // }
    this.gettime()
    this.ngsocGet()
    // this.$nextTick()
    // this.getNowTime(); //获取现在时间
  },
  methods: {
    async ngsocGet () {
      this.loading = true
      const res = await axios.get(`/ngsoc/get`)
      // console.log(res)
      if (res.code === 200 && res.data ? res.data.length === 0 : false) {
        this.$notification.error({
          description: '系统提示',
          message: '当前角色无二级单位数据'
        })
      }

      this.list = res.data
      // this.list = [{
      //   'organizeId': '74',
      //   'overviewToken': 'dc722c526d4060061ab12bee19255bd0a794aeb31d1581b3e8a15760162788b0xxxx',
      //   'dashboardToken': '354dea93adb52316dce58a56eaba47360f852f0eb9631628b29e73b3a390e45yyyy',
      //   'organizeName': '公规院',
      //   'parentId': '1',
      //   'root': false
      // }, {
      //   'organizeId': '75',
      //   'overviewToken': 'dc722c526d4060061ab12bee19255bd0a794aeb31d1581b3e8a15760162788b0aaaa',
      //   'dashboardToken': '354dea93adb52316dce58a56eaba47360f852f0eb9631628b29e73b3a390e45bbbb',
      //   'organizeName': '一公局',
      //   'parentId': '1',
      //   'root': false
      // }]
      if (this.list.length > 0) {
        // console.log(this.list);
        this.selectedOrganize = this.list[0].organizeId
        // console.log(this.selectedOrganize);
        this.handleChange(this.selectedOrganize)
      } else {
        this.loading = false
        this.drawPolicitalStatus()
        this.drawPolicitalStatus2()
        this.drawPolicitalStatus22()
        this.drawPolicitalStatus3()
        this.drawPolicitalStatus4()
      }
    },
    // 下拉菜单
    handleChange (value) {
      this.loading = true
      // console.log(`selected ${value}`)
      // 根据valu查找list的单位
      const foundData = this.list.find(item => item.organizeId === value)
      // console.log(foundData)
      this.customviewQuery(foundData)
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async customviewQuery (foundData) {
      const instance = ajax.create({
        baseURL: process.env.VUE_APP_XUNJIAN_API_BASE_URL,
        headers: {
          'Content-Type': 'application/json'
          // "NGSOC-Access-Token": `${foundData.overviewToken}`
        },
        params: {
          token: foundData.overviewToken
        }
      })
      // console.log(instance());
      // 1.综合风险趋势
      // const comprehensive = await instance.get('/overviews/comprehensive-risk-trend')
      /*  const comprehensive = await instance.get('/ngsoc/depart/comprehensive-risk-trend')
        // 2.未处置完成的告警
        const alarm = await instance.get('/ngsoc/depart/alarm-stat')
        // 3.最近7天告警危害等级分布/
        const Last7Alarm = await instance.get('/ngsoc/depart/severity')
        // 4.最近7天威胁类型统计
        const Last7Threat = await instance.get('/ngsoc/depart/category') */

      const Promise1 = instance.get('/ngsoc/depart/comprehensive-risk-trend')
      const Promise2 = instance.get('/ngsoc/depart/alarm-stat')
      const Promise3 = instance.get('/ngsoc/depart/severity')
      const Promise4 = instance.get('/ngsoc/depart/category')

      try {
        const [comprehensive, alarm, Last7Alarm, Last7Threat] = await Promise.all([Promise1, Promise2, Promise3, Promise4])

        let comprehensiveData
        if (comprehensive.data.code === 200) {
          comprehensiveData = comprehensive.data.data ? comprehensive.data.data : []
        } else {
          comprehensiveData = []
        }
        // 到这给第一个图表数据
        if (comprehensiveData) {
          comprehensiveData.map(item => {
            // console.log(item);
            item.time = this.formatTimestamp(parseInt(item.time))
            this.listData1.push(item.risk)
            this.listTime1.push(item.time)
            return item
          })
        } else {
          this.listData1 = []
          this.listTime1 = []
        }
        console.log(!!alarm.data.code)
        console.log(alarm.data.msg === 'OK')
        if (alarm.data.code && alarm.data.msg === 'OK') {
          this.listData2 = alarm.data.data.alarmSeverityGroupStat
          this.listData22 = [alarm.data.data.outAttackAlarm,
            alarm.data.data.movementAlarm,
            alarm.data.data.assetOutreachAlarm,
            alarm.data.data.iocAlarm,
            alarm.data.data.maliciousFileAlarm]
          this.listData22StartTime = this.timeformat(alarm.data.data.originalStartTime * 1)
          this.listData22EndTime = this.timeformat(alarm.data.data.originalEndTime * 1)

          this.iocAlarm_total = alarm.data.data.iocAlarm.total
          this.outAttackAlarm_total = alarm.data.data.outAttackAlarm.total
          this.movementAlarm_total = alarm.data.data.movementAlarm.total
          this.assetOutreachAlarm_total = alarm.data.data.assetOutreachAlarm.total
          this.maliciousFileAlarm_total = alarm.data.data.maliciousFileAlarm.total
        } else {
          console.log('false')
          this.outAttackAlarm_total = false
          this.listData2 = []
          this.listData22 = []
          this.listData22StartTime = '0-0-0-0 0:0:0'
          this.listData22EndTime = '0-0-0-0 0:0:0'
        }

        // console.log('告警危害等级分布', Last7Alarm)
        if (Last7Alarm.data.code === 200) {
          this.listData3 = Last7Alarm.data
        } else {
          this.listData3 = []
        }

        if (Last7Threat.data.code === 200) {
          this.listData4 = Last7Threat.data
        } else {
          this.listData4 = []
        }
      } catch (e) {
        this.loading = false
        this.listData1 = []
        this.listTime1 = []
        this.listData1 = []
        this.listData2 = []
        this.listData22 = []
        this.listData3 = []
        this.listData4 = []
        this.outAttackAlarm_total = false
        this.listData22StartTime = '0-0-0-0 0:0:0'
        this.listData22EndTime = '0-0-0-0 0:0:0'
      } finally {
        this.loading = false
      }

      this.drawPolicitalStatus()
      this.drawPolicitalStatus2()
      this.drawPolicitalStatus22()
      this.drawPolicitalStatus3()
      this.drawPolicitalStatus4()
      // console.log('威胁类型统计', Last7Threat)
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
    },

    drawPolicitalStatus () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.eacherbox1)
      // const listTime1 = this.listTime1
      // const listData1 = this.listData1

      // 判断数据是否为空
      const isDataEmpty = this.listData1.length === 0
      let datacoords = []
      if (this.listData1.length > 0) {
        // for (let i = 0; i < this.listData1.length - 1; i++) {
        //   datacoords.push({
        //     coords: [
        //       [this.listTime1[i], this.listData1[i]],
        //       [this.listTime1[i + 1], this.listData1[i + 1]]
        //     ]
        //   })
        // }
        datacoords = [
          {
            coords: [
              [this.listTime1[0], this.listData1[0]],
              [this.listTime1[this.listTime1.length - 1], this.listData1[this.listTime1.length - 1]]
            ]
          }
        ]
      }

      // 配置 graphic，用于显示 "暂无数据"
      const graphic = {
        type: 'text',
        left: 'center',
        top: 'middle',
        silent: true,
        invisible: !isDataEmpty, // 如果没有数据，则显示文本
        style: {
          fill: '#9d9d9d',
          fontWeight: 'bold',
          text: '暂无数据',
          fontFamily: 'Microsoft YaHei',
          fontSize: '250%'
        }
      }

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
        },
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '15%'
        },
        xAxis: {
          show: !isDataEmpty,
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DBDBDB'
            }
          },
          axisLabel: {
            margin: 13.5,
            fontFamily: 'ArialMT',
            color: '#81BAE5',
            lineHeight: 12
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: this.listTime1
        },
        yAxis:
          {
            name: '',
            nameTextStyle: {
              color: '#81BAE5',
              fontSize: 12,
              padding: [0, 60, 0, 0]
            },
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f0f0f0',
                type: 'dotted'
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
            },
            data: this.listData1
          },
        series: [
          {
            name: '情景值',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            lineStyle: {
              normal: {
                width: 2,
                color: '#ff974c'
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: '#fff',
                  position: 'top',
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
            areaStyle: {
              normal: {
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
            // 数据为空时不传入数据
            data: isDataEmpty ? [] : this.listData1
          }

          /* // 流光代码
          {
            showSymbol: false,
            type: 'lines',
            smooth: false,
            coordinateSystem: 'cartesian2d',
            zlevel: 1,
            effect: {
              show: true,
              smooth: true,
              period: 3,
              symbolSize: 5,
              symbol: 'arrow',
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: 'rgba(0, 105, 194, 1)' },
                { offset: 0.5, color: 'rgba(0, 105, 194, 0.5)' },
                { offset: 1, color: 'rgba(0, 105, 194, 0.1)' }
              ]),
              trailLength: 0.1
            },
            lineStyle: {
              color: '#fff',
              width: 1,
              opacity: 0,
              curveness: 0,
              cap: 'round'
            },
            data: datacoords
          } */
        ],
        graphic: [graphic] // 将 graphic 配置传入图表
      })

      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 未处置---------------
    drawPolicitalStatus2 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart2 = echarts.init(this.$refs.eacherbox21)
      const colorList = ['#3CA6FF', '#EAE174', '#FFA044', '#DC5656']
      const nameList = ['低危', '中危', '高危', '危急']
      const data = []
      let num = 0
      // 判断数据是否为空
      const isDataEmpty = this.listData2.length === 0
      if (!isDataEmpty) {
        for (let i = this.listData2.length - 1; i >= 0; i--) {
          num += this.listData2[i].alarmCount
          data.push({
            value: this.listData2[i].alarmCount,
            name: nameList[i],
            itemStyle: {
              normal: {
                color: colorList[i]
              },
              emphasis: {
                color: colorList[i]
              }
            }
          })
        }
      }
      // 配置 graphic，用于显示 "暂无数据"
      const graphic = {
        type: 'text',
        left: 'center',
        top: 'middle',
        silent: true,
        invisible: !isDataEmpty, // 如果没有数据，则显示文本
        style: {
          fill: '#9d9d9d',
          fontWeight: 'bold',
          text: '暂无数据',
          fontFamily: 'Microsoft YaHei',
          fontSize: '250%'
        }
      }

      myChart2.setOption({
        title: {
          text: num > 0 ? num : '',
          subtext: num > 0 ? '总数' : '',
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
          show: true,
          trigger: 'item'
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
            selectedMode: false,
            formatter: function (name) {
              let value = 0
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === name) {
                  value = data[i].value
                  break
                }
              }
              return name + ' ' + value
            },
            textAlign: 'left',
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
            selectedMode: false,
            formatter: function (name) {
              let value = 0
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === name) {
                  value = data[i].value
                  break
                }
              }
              return name + ' ' + value
            },
            textAlign: 'left',
            data: [{ name: '中危' }, { name: '危急' }],
            width: 160
          }
        ],
        series: [
          {
            type: 'pie',
            top: '0',
            bottom: '0',
            center: ['50%', '40%'],
            radius: ['30%', '55%'],
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
        ],
        // 将 graphic 配置传入图表
        graphic: [graphic]
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

    // 处理时间数据格式为2023-12-21 06:02:17
    timeformat (mytime) {
      const date = new Date(mytime)
      return date.toISOString().slice(0, 19).replace('T', ' ')
    },
    // 未处置---------------
    drawPolicitalStatus22 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart22 = echarts.init(this.$refs.eacherbox22)
      const nameData = ['外部攻击告警', '横向移动告警', '资产外外连告警', '命中威胁告警', '恶意文件告警'] // 年份
      const threatLevels = ['危急', '高危', '中危', '低危']
      let threatData = []
      if (threatLevels) {
        threatData = threatLevels.map(threatLevel => {
          return Object.keys(this.listData22).reduce((acc, alarmType) => {
            const threatLevelData = this.listData22[alarmType].alarmSeverityGroupStat.find(item => item.severityString === threatLevel)
            acc.push(threatLevelData ? threatLevelData.alarmCount : 0)
            return acc
          }, [])
        })
      }

      // 判断数据是否为空
      const isDataEmpty = threatData.every(data => data.every(value => value === 0))
      // console.log(isDataEmpty)
      const data1Arr = threatData[0] // "危急"
      const data2Arr = threatData[1] // "高危"
      const data3Arr = threatData[2] // "中危"
      const data4Arr = threatData[3] // "低危"

      /* 整合 */
      const dataList = [data1Arr, data2Arr, data3Arr, data4Arr]
      const colorList = ['#DC5656', '#FFA044', '#EAE174', '#3CA6FF', '#002F54']
      const seriesList = []
      const list_total = this.outAttackAlarm_total ? [this.outAttackAlarm_total, this.movementAlarm_total, this.assetOutreachAlarm_total, this.iocAlarm_total, this.maliciousFileAlarm_total] : []
      const maxNumber = Math.max(...list_total)
      for (let index = 0; index < threatLevels.length; index++) {
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
          backgroundStyle: {
            color: '#F1F1F1' // 柱形图中柱子的背景颜色
          },
          label: {
            show: false // 图上的数据(例如柱形图最上面的展示数据)
          }
        })
      }
      seriesList.push({
        symbolBoundingData: maxNumber * 1.1,
        itemStyle: {
          normal: {
            color: 'none' // 设置柱形图的颜色为透明
          },
          emphasis: {
            color: 'none' // 设置柱形图的颜色为透明
          }
        },

        type: 'pictorialBar',
        barWidth: '12', // 柱型宽度
        data: list_total,
        emphasis: {
          focus: 'series'
        },
        showBackground: true,
        label: {
          show: true, // 图上的数据(例如柱形图最上面的展示数据)
          position: 'right',
          distance: 1, // 向右偏移位置
          color: '#333',
          fontFamily: 'HarmonyOS Sans-Regular'
        }
      })
      // console.log(seriesList)
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
          right: '150',
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
            },
            splitLine: {
              show: false
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
            data: isDataEmpty ? [] : nameData,
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
          // y轴总和
          /* {
            type: 'category',
            data: [50, 50, 100, 20, 60],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              inside: true,
              align: 'right',
              // verticalAlign: 'bottom',
              padding: [0, 0, 0, -50],
              textStyle: {
                color: '#81BAE5',
                fontSize: '12',
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fonWeight: 600
              }
            }
          } */
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
      })

      // 配置 graphic，用于显示 "暂无数据"
      const graphic = {
        type: 'text',
        left: 'center',
        top: 'middle',
        silent: true,
        invisible: !isDataEmpty, // 如果没有数据，则显示文本
        style: {
          fill: '#9d9d9d',
          fontWeight: 'bold',
          text: '暂无数据',
          fontFamily: 'Microsoft YaHei',
          fontSize: '250%'
        }
      }

      myChart22.setOption({
        // backgroundColor: option.backgroundColor,
        tooltip: option.tooltip,
        // legend: option.legend,
        grid: option.grid,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        series: optionWithData,
        // 将 graphic 配置传入图表
        graphic: [graphic]
      })
      // console.log({
      //   backgroundColor: option.backgroundColor,
      //   tooltip: option.tooltip,
      //   // legend: option.legend,
      //   grid: option.grid,
      //   xAxis: option.xAxis,
      //   yAxis: option.yAxis,
      //   series: optionWithData,
      //   // 将 graphic 配置传入图表
      //   graphic: [graphic]
      // })
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

      // 判断数据是否为空
      const isDataEmpty = data.every(item => item.value === 0)

      // 绘制图表
      myChart3.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '37',
          right: '10',
          bottom: '5%',
          top: '20%',
          containLabel: true
        },
        legend: {
          top: '6%',
          left: 140,
          icon: 'circle',
          textStyle: {
            fontSize: 12,
            color: '#81BAE5'
          },
          itemWidth: 25,
          itemGap: 20,
          selectedMode: false,
          formatter: function (name) {
            let value = 0
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                value = data[i].value
                break
              }
            }
            return name + ' ' + value
          },
          data: isDataEmpty ? [] : ['危急', '高危', '中危', '低危']
        },
        dataZoom: [
          {
            show: false,
            xAxisIndex: [0],
            bottom: 6,
            start: 0,
            end: 100,
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
          show: !isDataEmpty,
          type: 'category',
          name: '',
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 12
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DBDBDB'
            }
          },
          axisLabel: {
            margin: 13.5,
            fontFamily: 'ArialMT',
            color: '#81BAE5',
            lineHeight: 12
          },
          data: severityTime
        },
        yAxis: {
          type: 'value',
          name: '',
          nameTextStyle: {
            color: 'rgba(255,255,255,0.7)'
          },
          axisLine: {
            show: false
          },
          axisLabel: {
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
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '危急',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7,
            itemStyle: {
              normal: {
                color: '#DC5656'
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: severity4
          },
          {
            name: '高危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7,
            itemStyle: {
              normal: {
                color: '#FFA044'
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: severity3
          },
          {
            name: '中危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7,
            itemStyle: {
              normal: {
                color: '#EAE174'
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: severity2
          },
          {
            name: '低危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7,
            itemStyle: {
              normal: {
                color: '#3CA6FF'
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: severity1
          }
        ],
        // 配置 graphic，用于显示 "暂无数据"
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 'middle',
            silent: true,
            invisible: !isDataEmpty, // 如果没有数据，则显示文本
            style: {
              fill: '#9d9d9d',
              fontWeight: 'bold',
              text: '暂无数据',
              fontFamily: 'Microsoft YaHei',
              fontSize: '250%'
            }
          }
        ]
      })

      window.addEventListener('resize', function () {
        console.log('重绘')
        myChart3.resize()
      })
    },

    // 最近7天威胁类型统计
    drawPolicitalStatus4 () {
      const rule_category_id = []
      const ruleName = []
      const severityTime = []
      let resultArray

      // 没有数据，显示 "暂无数据"
      const myChart4 = echarts.init(this.$refs.eacherbox4)
      myChart4.clear()
      try {
        // console.log(this.listData4.data.data)
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
          // console.log(result)
          // 将结果转换为数组形式
          // 计算每个对象中count_values数组的和，并添加到对象中
          Object.values(result).forEach(item => {
            // console.log(item)
            item.total_count = item.count_values.reduce((total, count) => total + count, 0)
          })
          resultArray = Object.values(result)

          // console.log(resultArray, severityTime, ruleName)
        }
      } catch (error) {

      }
      if (ruleName.length <= 0) {
        myChart4.setOption({
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: 'middle',
              silent: true,
              style: {
                fill: '#9d9d9d',
                fontWeight: 'bold',
                text: '暂无数据',
                fontFamily: 'Microsoft YaHei',
                fontSize: '250%'
              }
            }
          ]
        })

        window.addEventListener('resize', function () {
          myChart4.resize()
        })

        return
      }

      const colorList = ['#3CA6FF', '#EAE174', '#DC5656', '#FFA044', '#BF78C5']
      const dataList = []
      const seriesList = []
      for (let i = 0; i < resultArray.length; i++) {
        dataList.push({
          value: resultArray[i].total_count,
          name: ruleName[i],
          itemStyle: {
            normal: {
              color: colorList[i]
            },
            emphasis: {
              color: colorList[i]
            }
          }
        })
        seriesList.push({
          name: ruleName[i],
          type: 'line',
          data: resultArray[i].count_values,
          smooth: true, // 平滑曲线
          itemStyle: {
            normal: {
              color: colorList[i],
              borderColor: colorList[i],
              borderWidth: 2
            }
          },
          lineStyle: {
            width: 2
          },
          symbol: 'emptyCircle',
          symbolSize: 6
        })
      }

      // 绘制图表
      myChart4.setOption({
        tooltip: {
          trigger: 'axis'
        },

        legend: {
          top: '6%',
          left: 100,
          icon: 'circle',
          textStyle: {
            fontSize: 12,
            color: '#81BAE5'
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
            return name + ' ' + value
          },
          data: ruleName
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
          name: '',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DBDBDB'
            }
          },
          axisLabel: {
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
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f0f0f0',
              type: 'dotted'
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
          },
          nameTextStyle: {
            color: '#81BAE5',
            fontSize: 12,
            padding: [0, 60, 0, 0]
          }
        },
        series: seriesList
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
      //width: 330px;
      width: 440px;
    }

    .textTime {
      // width: 100px;
      height: 20px;
      display: flex;

        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 20px;

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
  height: 260px;
  width: 430px;
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
