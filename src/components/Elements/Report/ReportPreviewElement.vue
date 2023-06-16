<template>
  <div class="border">
    <a-row :gutter="[24,16]">
      <a-col :span="24">
        <img src="./img/大标题.png" class="biaoti">
      </a-col>
    </a-row>
    <div class="abs" style="top: 90px;left: 20px;">
      <cir :number="mainAlarm"></cir>
    </div>

    <div class="abs" style="top: 90px;left: 252px;">
      <cir :number="allAlarm" type="all"></cir>
    </div>

    <div class="abs" style="top: 90px;left: 488px;">
      <seven :number="past7Alarm" :chartData="past7MainList"></seven>
    </div>

    <div class="abs" style="top: 90px;left: 1204px;">
      <seven title="过去7天所有告警" :number="post7AllAlarm" type="all" :chartData="past7AllList"></seven>
    </div>

    <!--    接入平台-->
    <div class="abs" style="top: 290px;left: 970px;">
      <tit></tit>
      <color>
        <span style="color: #00F9FF;top: 400px;left: 100px;" class="abs"></span>
      </color>
    </div>

    <!--    告警处置统计-->
    <div class="abs" style="top: 687px;left: 20px;">
      <tit name="告警处置统计"></tit>
      <a-range-picker
        v-model="dealTime"
        format="YYYY/MM/DD HH:mm"
        @change="dealAlarm"
        class="abs rangePickerIceGai"
        style="width: 234px;height: 28px;left: 684px;top: 5px;">
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
      <AlarmStatistics ref="tongji"></AlarmStatistics>
    </div>

    <!--    告警分级统计-->
    <div class="abs" style="top: 687px;left: 970px;">
      <tit name="告警分级统计"></tit>
      <a-range-picker
        v-model="levelTime"
        format="YYYY/MM/DD HH:mm"
        @change="levelAlarm"
        class="abs rangePickerIceGai"
        style="width: 234px;height: 28px;left: 684px;top: 5px;">
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
      <AlarmStatistics ref="level" :option="peizhi"></AlarmStatistics>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import cir from '~~~/Elements/Report/circle'
import seven from '~~~/Elements/Report/SevenDayChart'
import tit from '~~~/Elements/Report/title'
import color from '~~~/Elements/Report/ColorMask'
import AlarmStatistics from '~~~/Elements/Report/AlarmStatistics'
import { sql } from '@/utils/request'
import {
  currentAlarm,
  currentMainAlarm, handingLevel, handlingAlarm, handlingAvgClaimTime, handlingAvgTime, past7DaysAllAlarm,
  past7DaysMainAlarm,
  pastAllSevenDayAlarm,
  pastSevenDayAlarm
} from '~~~/Elements/Report/sql'
import { dealQuery, sqlResultDealer } from '@/utils/util'
import moment from 'moment'

const peizhi = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {
    right: '0%',
    orient: 'vertical',
    top: '13%',
    itemGap: 30,
    textStyle: {
      color: '#B0BDCD',
      padding: [5, 10, 5, 10]
    }
  },
  grid: {
    width: '830px',
    height: '250px',
    top: 'middle',
    right: '5%',
    left: '10%'
  },
  xAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#A9B7C8'
    },
    axisLine: {
      lineStyle: {
        color: '#FFF'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    splitLine: {
      show: false
    },
    axisLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#A9B7C8'
    },
    lineStyle: {
      color: '#fff'
    },
    axisLine: {
      lineStyle: {
        color: '#FFF'
      }
    }
  },
  series: [
    {
      name: 'Direct',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 302, 301, 334, 390, 330, 320]
    },
    {
      name: 'Mail Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, undefined, 101, 134, 90, 230, 210]
    },
    {
      name: 'Affiliate Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [150, 212, 201, 154, 190, 330, 410]
    },
    {
      name: 'Search Engine',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [820, 832, 901, 934, 1290, 1330, 1320]
    }
  ]
}
export default {
  name: 'ReportPreviewElement',
  components: { cir, seven, tit, color, AlarmStatistics },
  data () {
    return {
      peizhi,
      mainAlarm: 0,
      allAlarm: 0,
      past7Alarm: 0,
      post7AllAlarm: 0,
      past7MainList: [],
      past7AllList: [],
      dealTime: [moment().add(-7, 'd').format('YYYY/MM/DD HH:mm'), moment().format('YYYY/MM/DD HH:mm')],
      levelTime: [moment().add(-7, 'd').format('YYYY/MM/DD HH:mm'), moment().format('YYYY/MM/DD HH:mm')]
    }
  },
  methods: {
    moment,
    handingLevel,
    async loadTodayMain () {
      const res = dealQuery(await sql(currentAlarm))
      this.mainAlarm = _.get(res, '0.total', 0)
      const res_all = dealQuery(await sql(currentMainAlarm))
      this.allAlarm = _.get(res_all, '0.total', 0)
      const res_7_main = dealQuery(await sql(pastSevenDayAlarm))
      this.past7Alarm = _.get(res_7_main, '0.total', 0)
      const res_7_all = dealQuery(await sql(pastAllSevenDayAlarm))
      this.post7AllAlarm = _.get(res_7_all, '0.total', 0)
      const res_7_main_list = sqlResultDealer(await sql(past7DaysMainAlarm))
      this.past7MainList = res_7_main_list
      const res_7_all_list = dealQuery(await sql(past7DaysAllAlarm))
      this.past7AllList = res_7_all_list
    },
    mergeArrays (arrays, key) {
      return arrays.reduce((mergedArray, currentArray) => {
        currentArray.forEach((obj) => {
          const existingObj = mergedArray.find((item) => item[key] === obj[key])
          if (existingObj) {
            Object.assign(existingObj, obj)
          } else {
            mergedArray.push(obj)
          }
        })
        return mergedArray
      }, [])
    },
    async dealAlarm (dates, dateStrings) {
      const date = dateStrings || this.dealTime
      const handingTime = dealQuery(await sql(handlingAvgTime(date)))
      const claimHour = dealQuery(await sql(handlingAvgClaimTime(date)))
      const handingRate = dealQuery(await sql(handlingAlarm(date)))
      const arr = this.mergeArrays([handingTime, claimHour, handingRate], 'name')
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          textStyle: {
            color: '#B0BDCD'
          }
        },
        grid: {
          width: '800px',
          height: '250px',
          top: 'middle',
          right: '5%'
        },
        xAxis: {
          type: 'category',
          data: ['avg_claim_time', 'avg_process_rate', 'avg_process_time'],
          axisLabel: {
            fontSize: '12px',
            fontWeight: '400',
            color: '#A9B7C8'
          },
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: '12px',
            fontWeight: '400',
            color: '#A9B7C8'
          },
          lineStyle: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          }
        },
        series: [
          {
            name: '平均告警时间',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: arr.map(el => _.get(el, 'avg_claim_time', undefined))
          },
          {
            name: '平均审核时间',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: arr.map(el => _.get(el, 'avg_process_time', undefined))
          },
          {
            name: '平均审核率',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: arr.map(el => _.get(el, 'avg_process_rate', undefined))
          }
        ]
      }
      this.$refs.tongji.mergeOption(option)
    },
    async levelAlarm (dates, dateStrings) {
      const date = dateStrings || this.levelTime
      const handingLevel = dealQuery(await sql(this.handingLevel(date)))
      this.peizhi.yAxis.data = handingLevel ? handingLevel.map(el => el.collect) : []
      this.peizhi.series = [1, 2, 3, 4, 5].map(el => {
        return {
          name: `Level${el}`,
          type: 'bar',
          stack: 'total',
          // label: {
          //   show: true
          // },
          emphasis: {
            focus: 'series'
          },
          data: handingLevel.map(el => _.get(el, `level${el}`, 0))
        }
      })
      this.$refs.level.mergeOption(this.peizhi)
      // this.$refs.tongji.mergeOption(option)
    }
  },
  mounted () {
    this.loadTodayMain()
    this.levelAlarm()
    this.dealAlarm()
  }
}
</script>

<style>
.rangePickerIceGai {
  background: #2877BF;
  color: #B0C9E8;
}

.border {
  background-color: #152F57;
  height: 1080px;
  width: 1920px;
  opacity: 100%;
  position: relative;
}

.abs {
  position: absolute;
}

.biaoti {
  width: 1869px;
  height: 62px;
  margin-left: 18px;
  border: 2px solid;
}
</style>
