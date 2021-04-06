import uuid from 'uuid/v4'
import moment from 'moment'
import _ from 'lodash'

export class TimeRangeModel {
  // example: A08:45-A10:45,A10:45-A13:45,A13:45-A15:45,A15:45-A19:45
  constructor (interval = '') {
    this.dataSource = interval
      .split(',')
      .map((timeRange) => {
        const [start = '', end = ''] = timeRange.split('-')
        return {
          start: {
            dayType: start.slice(0, 1),
            time: start.slice(1)
          },
          end: {
            dayType: end.slice(0, 1),
            time: end.slice(1)
          },
          uuid: uuid()
        }
      })
  }

  add () {
    const { end: { dayType, time } } = _.last(this.dataSource) || {
      dayType: 'A',
      time: moment().format('HH:mm')
    }

    // moment 比较时间需跟上年月日
    const startTime = `${moment().format(`YYYY-MM-DD`)} ${time}`
    const startMoment = moment(startTime, 'YYYY-MM-DD HH:mm')
    const endMoment = moment(startMoment).add(2, 'hours')

    this.dataSource.push({
      start: {
        dayType: dayType,
        time: time
      },
      end: {
        dayType: startMoment.isSame(endMoment, 'day') ? dayType : 'B',
        time: endMoment.format('HH:mm')
      },
      uuid: uuid()
    })
  }

  remove (index) {
    this.dataSource.splice(index, 1)
  }

  serialize () {
    return this.dataSource
      .map(({ start, end }) => `${start.dayType}${start.time}-${end.dayType}${end.time}`)
      .join('-')
  }

  toJson () {
    return this.serialize()
  }
}
