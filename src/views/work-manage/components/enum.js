import _ from 'lodash'
import moment from 'moment'
export const weekMap = new Map([
  [1, '周一'],
  [2, '周二'],
  [3, '周三'],
  [4, '周四'],
  [5, '周五'],
  [6, '周六'],
  [0, '周日']
])

export const dealObject = (clone) => {
  const params = {
    schedule: {},
    task: []
  }
  const obj = _.cloneDeep(clone)
  params.schedule.name = obj.name
  params.schedule.effectiveTime = obj.rangeTime[0].format('YYYY-MM-DD')
  params.schedule.expireTime = obj.rangeTime[1].format('YYYY-MM-DD')
  params.schedule.dataType = obj.sendType
  params.schedule.remarks = obj.plan
  obj.plan.map(el => {
    for (let time = moment(params.schedule.effectiveTime); Number(obj.rangeTime[1].diff(time, 'hour')) >= 0; time.add(1, 'day')) {
      if (obj.sendType === 'day') {
        params.task.push({
          startTime: time.format('YYYY-MM-DD') + ' ' + el.startTime.format('HH:mm'),
          endTime: time.format('YYYY-MM-DD') + ' ' + el.endTime.format('HH:mm'),
          account: el.account.split('|||||||||')[1]
        })
      } else {
        if (el.weekNumber.includes(Number(time.format('d')))) {
          console.log('range', obj.rangeTime[1].format('YYYY-MM-DD'), time.format('YYYY-MM-DD'), obj.rangeTime[1].diff(time, 'day'), obj.rangeTime[1].diff(time, 'hour'))
          params.task.push({
            startTime: time.format('YYYY-MM-DD') + ' ' + el.startTime.format('HH:mm'),
            endTime: time.format('YYYY-MM-DD') + ' ' + el.endTime.format('HH:mm'),
            account: el.account.split('|||||||||')[1]
          })
        }
      }
    }
  })
  return params
}
