import { CronModel } from './Cron/CronModel'
import { TimeRangeModel } from './TimeRange/TimeRangeModel'
import moment from 'moment'

export const timeFormat = 'YYYY-MM-DD HH:mm:ss'

export class PlanModel {
  constructor ({
    interval = '',
    schedule = '',
    alias = '',
    groupId = '',
    id = '',
    effectTime = '',
    expireTime = '',
    crash = {},
    pathId = '',
    zoneId = '',
    exception = [],
    status = ''
  }) {
    this.alias = alias
    this.schedule = new CronModel(schedule)
    this.interval = new TimeRangeModel(interval)
    this.effectTime = effectTime
    this.crash = crash
    if (id) {
      this.id = id
    }
    this.pathId = pathId
    this.zoneId = zoneId
    this.exception = (exception === '') ? [] : exception.split(',')
    this.groupId = groupId
    this.expireTime = expireTime
    this.status = status
  }

  serialize () {
    const { schedule, interval, effectTime, expireTime, crash, exception, groupId, ...plan } = this
    const obj = {
      schedule: schedule.serialize(),
      interval: interval.serialize(),
      effectTime: moment(effectTime).format(timeFormat),
      expireTime: moment(expireTime).format(timeFormat),
      createTime: moment(new Date()).format(timeFormat),
      groupId: groupId,
      ...plan
    }
    if (exception) {
      Reflect.set(obj, 'exception', exception.toString())
    }
    return obj
  }

  toJson () {
    return this.serialize()
  }
}
