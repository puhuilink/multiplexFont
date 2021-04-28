import { CronModel } from './Cron/CronModel'
import { TimeRangeModel } from './TimeRange/TimeRangeModel'
import moment from 'moment'

export const timeFormat = 'YYYY-MM-DD HH:mm:ss'

export class PlanModel {
  constructor ({
    interval = '',
    schedule = '0 30 0 * * * ?',
    alias = '',
    group_id = '',
    id = '',
    effectTime = '',
    crash = {}
  }) {
    this.alias = alias
    this.group_id = group_id
    this.schedule = new CronModel(schedule)
    this.interval = new TimeRangeModel(interval)
    this.effectTime = effectTime
    this.crash = crash
    if (id) {
      this.id = id
    }
  }

  serialize () {
    const { schedule, interval, effectTime, ...plan } = this
    const { effect, expire } = effectTime
    console.log('rest', plan)
    return {
      schedule: schedule.serialize(),
      interval: interval.serialize(),
      effect: moment(effect).format(timeFormat),
      expire: moment(expire).format(timeFormat),
      ...plan
    }
  }

  toJson () {
    return this.serialize()
  }
}
