/*
 * 任务日历
 */
<template>
  <div class="task-calendar">
    <a-card :bordered="false">

      <div class="operation">
        <a-cascader
          :options="screening.ascriptionList"
          placeholder="全部"
          @change="ascriptionChange"
          style="width: 280px"
        />
      </div>
      <!-- / 选择器 -->

      <div class="perform">
        <div class="status-demo" v-for="p in performStatus" :key="p.label">
          <span class="demo-dot" :style="{background:p.color}"></span>
          <span>{{ p.label }}</span>
        </div>
      </div>
      <!-- / 执行状况分类 -->

      <a-calendar
        mode="month"
        @select="onSelect"
        @panelChange="onChange"
      >
        <!-- @change="onChange" -->
        <ul class="events" slot="dateCellRender" slot-scope="value">
          <template v-if="getDataListOK">
            <li class="item ant-badge-status" v-for="(item, index) in getListData(value)" :key="index">
              <span
                class="dot"
                :style="item.work_state==''?{backgroundColor:'#f8f9fa'}:item.work_state=='未执行'
                  ?{backgroundColor:'#007bff'}:item.work_state=='执行完成'
                    ?{backgroundColor: '#28a745'}:item.work_state=='执行失败'
                      ?{backgroundColor:'#dc3545'}:item.work_state=='执行完成发现异常'?{backgroundColor: '#ffc107'}:{}"
              ></span>
              <span class="">{{ item.work_start_time }} {{ item.content }} {{ item.df_transactor_name }} {{ item.task_name }}</span>
            </li>
          </template>
        </ul>
      </a-calendar>
      <!-- / 巡检日历 -->

      <detail ref="detail"></detail>
      <!-- / 模块 -->
    </a-card>
  </div>
</template>

<script>
import detail from '../modules/TCDetail'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import moment from 'moment'
import screening from '../screening'
import _ from 'lodash'

const queryBefore = gql`query xunjian ($where: t_xj_task_info_bool_exp = {}){
  data: t_xj_task_info(where: $where) {
    task_id
    task_name
    task_status
    task_state
    plan_code
    plan_start_time
    df_transactor_code
    df_transactor_name
    transactor_name
    transactor_code
  }
}`
const queryLater = gql`query xunjian($where: t_xj_plan_info_bool_exp = {}) {
  data: t_xj_plan_info(where: $where) {
    ascription
    create_time
    create_user_code
    start_time
    end_time
    cycle_type
    cycle_value
    create_user
    group_code
    group_member
    is_enable
    plan_code
    plan_id
    plan_name
    plan_type
    route_code
    work_time
    update_time
  }
}`
export default {
  name: 'TaskCalendar',
  components: {
    detail
  },
  data () {
    return {
      screening,
      ascriptionChoose: '',
      dateQuery: {
        startDate: '',
        currentDate: '',
        endDate: ''
      },
      queryParam: {
        ascription: ''
      },
      performStatus: [
        {
          type: '',
          color: '#f8f9fa',
          label: '无状态'
        },
        {
          type: 'AB',
          color: '#007bff',
          label: '未执行'
        },
        // {
        //   type: 'c',
        //   color: '#28a745',
        //   label: '执行中'
        // },
        {
          // 异常为否
          type: 'DE',
          color: '#28a745',
          label: '执行完成'
        },
        {
          type: 'F',
          color: '#dc3545',
          label: '执行失败'
        },
        {
          // 异常为是
          type: 'DE',
          color: '#ffc107',
          label: '执行完成发现异常'
        }
      ],
      taskList: [],
      selectedValue: '',
      allDataList: [ ],
      getDataListOK: false
    }
  },
  filters: {},
  async created () {
    await this.getTheDate()
    await this.getAllData()
  },
  methods: {
    async ascriptionChange (e) {
      console.log(e)
      this.ascriptionChoose = e[e.length - 1]
      this.queryParam.ascription = e[e.length - 1]
      this.getAllData()
      this.getListData()
    },
    async loadBeforeData (parameter) {
      return apollo.clients.alert.query({
        query: queryBefore,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.ascriptionChoose ? {
              ascription: {
                _eq: this.ascriptionChoose
              }
            } : {},
            plan_start_time: {
              _gte: this.dateQuery.startDate,
              _lte: this.dateQuery.endDate
            }
          }
        }
      }).then(r => {
        const list = r.data.data.map(r => ({
          ...r,
          work_start_date: r.plan_start_time.split('T')[0],
          work_start_time: r.plan_start_time.split('T')[1].substring(0, 5),
          work_state: this.getWorkState(r)
        })
        )
        const group = list.map(el => el.work_start_date).filter((el, i, curArr) => curArr.indexOf(el) === i)
        const a = Array.from(Array(group.length)).map(() => Array(0))
        list.forEach((el) => {
          a[group.indexOf(el.work_start_date)].push(el)
        })
        const bList = []
        for (let i = 0; i < group.length; i++) {
          const bData = {
            date: group[i],
            taskList: a[i]
          }
          bList.push(bData)
        }
        return bList || []
      })
    },
    getWorkState (e) {
      let workState
      switch (e.task_status) {
        case 'A':
          workState = '未执行'
          break
        case 'B':
          workState = '未执行'
          break
        case 'D':
          e.task_state === 'Y' ? workState = '执行完成' : workState = '执行完成发现异常'
          break
        case 'E':
          e.task_state === 'Y' ? workState = '执行完成' : workState = '执行完成发现异常'
          break
        case 'F':
          workState = '执行失败'
          break
        default:
          workState = e.task_status
          break
      }
      // if (e.task_status === 'A' || e.task_status === 'B') {
      //   workState = '未执行'
      // } else if (e.task_status === 'A' || e.task_status === 'B') {
      //   e.task_state === 'Y' ? workState = '执行完成' : workState = '执行完成发现异常'
      // } else if (e.task_status === 'F') {
      //   workState = '执行失败'
      // } else {
      //   workState = e.task_status
      // }
      return workState
    },
    async loadLaterData (parameter) {
      return apollo.clients.alert.query({
        query: queryLater,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.ascriptionChoose ? {
              ascription: {
                _eq: this.ascriptionChoose
              }
            } : {},
            start_time: {
              _lte: this.dateQuery.currentDate
            },
            end_time: {
              _gte: this.dateQuery.endDate
            }
          }
        }
      }).then(r => {
        const dayList = this.getIntervalDayList()
        const dataList = r.data.data.map(r => ({
          ...r,
          work_start_date: r.start_time.split('T')[0],
          work_start_time: r.start_time.split('T')[1],
          work_end_date: r.end_time.split('T')[0]
        })
        )
        dayList.forEach(day => {
          dataList.forEach(data => {
            var curTime = new Date(Date.parse(day.date)).getTime()
            var startTime = new Date(Date.parse(data.work_start_date)).getTime()
            var endTime = new Date(Date.parse(data.work_end_date)).getTime()
            if (startTime < curTime && curTime < endTime) {
              day.planList.push(data)
            }
          })
          day.planList.forEach(plan => {
            plan.cycleValue = plan.cycle_value.split(',')
            plan.groupMember = plan.group_member.split(',')
            plan.workTime = plan.work_time.split(',').filter(function (item) {
              return item
            })
            // TODO: 根据周期类型去拼接taskList（具体字段见task_info表）
            if (plan.cycle_type === 'W') {
              console.log(111)
            }
            plan.taskList = plan.planList
          })
        })
        return []
      })
    },
    getIntervalDayList () {
      const start_time = moment(this.dateQuery.currentDate)
      const end_time = moment(this.dateQuery.endDate).endOf('d')
      const diff_times = end_time.diff(start_time, 'd')
      const arr = []
      _.times(diff_times, i => {
        const new_start_time = moment(start_time) // 每次重新初始化开始时间，因为我碰到了深拷贝的问题
        const planDate = {}
        planDate.date = new_start_time.add(i + 1, 'days').format('YYYY-MM-DD')
        planDate.planList = []
        planDate.taskList = []
        arr.push(planDate) // 数组下标从０开始，可以用它进行每次的天数递增
      })
      return arr
    },
    async getAllData () {
      const beforeData = await this.loadBeforeData()
      const laterData = await this.loadLaterData()
      const calendarData = beforeData.concat(laterData)
      this.getDataListOK = true
      this.allDataList = calendarData
    },
    getListData (value) {
      const calendarData = this.allDataList
      let listData = [ ]
      for (let i = 0; i < calendarData.length; i++) {
        if (calendarData[i].date === moment(value).format('YYYY-MM-DD')) {
          listData = calendarData[i].taskList
        }
      }
      return listData
    },
    onSelect (value) {
      console.log(value)
      this.selectedValue = value
      let chooseData
      const calendarData = this.allDataList
      for (let i = 0; i < calendarData.length; i++) {
        if (calendarData[i].date === moment(value).format('YYYY-MM-DD')) {
          chooseData = calendarData[i].taskList
        }
      }
      if (typeof (chooseData) === 'undefined') {
        console.log('该天没有数据 不做详情展示')
      } else {
        console.log(chooseData)
        this.$refs['detail'].open(chooseData)
      }
    },
    onChange (value) {
      console.log(value)
      this.getTheDate(value)
      this.getDataListOK = false
      this.getAllData()
    },
    getTheDate (value) {
      this.dateQuery = {
        startDate: moment(value).format('YYYY-MM-01'),
        currentDate: moment(value).format('YYYY-MM-DD'),
        endDate: moment(value).endOf('month').format('YYYY-MM-DD')
      }
    },
    /**
     * 获得传入日期是周几
     */
    getWhatDay (date) {
      var arys1 = []
      arys1 = date.split('-') // 日期为输入日期，格式为 2013-3-10
      var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2])
      var day = String(ssdate.getDay()).replace('0', '日')
        .replace('1', '一').replace('2', '二').replace('3', '三')
        .replace('4', '四').replace('5', '五').replace('6', '六') // 就是你要的星期几
      return day
    }
  }
}
</script>

<style scoped lang="less">
.task-calendar {
  .status-demo {
    display: inline-block;
    margin-right: 6px;

    .demo-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }
  .item {
    span {
      margin-right: 2px;
    }
    .dot  {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
  }

  .events {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  .notes-month {
    text-align: center;
    font-size: 28px;
  }
  .notes-month section {
    font-size: 28px;
  }
}
</style>
