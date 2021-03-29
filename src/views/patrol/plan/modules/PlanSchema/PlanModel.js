import { CronModel } from './Cron/CronModel'
import { TimeRangeModel } from './TimeRange/TimeRangeModel'

export class PlanModel {
  constructor ({
    interval = '',
    schedule = '* * * * * * *',
    alias = '',
    group_id = '',
    id = ''
  }) {
    this.alias = alias
    this.group_id = group_id
    this.schedule = new CronModel(schedule)
    this.interval = new TimeRangeModel(interval)
    if (id) {
      this.id = id
    }
  }

  serialize () {
    const { schedule, interval, ...plan } = this

    return {
      schedule: schedule.serialize(),
      interval: interval.serialize(),
      ...plan
    }
  }

  toJson () {
    return this.serialize()
  }
}
