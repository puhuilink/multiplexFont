import uuid from 'uuid/v4'
import moment from 'moment'

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
    // TODO: 在最后一条记录基础上+2
    const now = moment()
    this.dataSource.push({
      start: {
        dayType: 'A',
        time: now.format('HH:mm')
      },
      end: {
        dayType: 'A',
        time: now.add(2, 'hours').format('HH:mm')
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
