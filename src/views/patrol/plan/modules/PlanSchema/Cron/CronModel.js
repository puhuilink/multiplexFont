import _ from 'lodash'

export class CronModel {
  static dayOfWeekMapping = new Map([
    [1, '日'],
    [2, '一'],
    [3, '二'],
    [4, '三'],
    [5, '四'],
    [6, '五'],
    [7, '六']
  ])

  constructor (cron = '* * * * * *') {
    this.cron = cron
  }

  _split () {
    const [
      // 0 ~ 59
      seconds = '*',
      // 0 ~ 59
      minutes = '*',
      // 0 ~ 23
      hours = '*',
      // 1 ~ 31
      dayOfMonth = '*',
      // 1 ~ 12
      months = '*',
      // 1 ~ 7
      dayOfWeek = '*'
    ] = this.cron.split(' ')

    return {
      seconds,
      minutes,
      hours,
      dayOfMonth,
      months,
      dayOfWeek
    }
  }

  get everyDay () {
    return '0 30 0 * * *'
  }

  get dayOfMonth () {
    const { dayOfMonth } = this._split()
    return dayOfMonth.split(',').sort().map(el => ~~el)
  }

  set dayOfMonth (dayOfMonth = []) {
    console.log(dayOfMonth)
    if (_.isEmpty(dayOfMonth)) {
      this.useDayOfMonth()
    } else {
      this.cron = `0 30 0 ${
        dayOfMonth.sort().join(',')
      } * ?`
    }
  }

  get dayOfWeek () {
    const { dayOfWeek } = this._split()
    return dayOfWeek.split(',').sort().map(el => ~~el)
  }

  set dayOfWeek (dayOfWeek = []) {
    if (_.isEmpty(dayOfWeek)) {
      this.useDayOfWeek()
    } else {
      this.cron = `0 30 0 ? * ${
        dayOfWeek.sort().join(',')
      }`
    }
  }

  get isEveryDay () {
    return this.cron === this.everyDay
  }

  useEveryDay () {
    this.cron = '0 30 0 * * *'
  }

  get isDayOfWeek () {
    const { dayOfMonth, dayOfWeek } = this._split()
    return dayOfMonth === '?' && dayOfWeek !== '?'
  }

  useDayOfWeek () {
    this.cron = '0 30 0 ? * *'
  }

  get isDayOfMonth () {
    const { dayOfWeek, dayOfMonth } = this._split()
    return dayOfMonth !== '?' && dayOfWeek === '?'
  }

  useDayOfMonth () {
    this.cron = '0 30 0 * * ?'
  }

  get currentType () {
    const { isDayOfWeek, isEveryDay, isDayOfMonth } = this
    if (isDayOfWeek) return 'dayOfWeek'
    if (isEveryDay) return 'everyDay'
    if (isDayOfMonth) return 'dayOfMonth'
  }

  set currentType (currentType) {
    switch (currentType) {
      case 'dayOfWeek':
        return this.useDayOfWeek()
      case 'everyDay':
        return this.useEveryDay()
      case 'dayOfMonth':
        return this.useDayOfMonth()
      default:
        break
    }
  }

  get currentValue () {
    const { currentType } = this
    switch (currentType) {
      case 'dayOfWeek':
        return this.dayOfWeek
      case 'dayOfMonth':
        return this.dayOfMonth
      default:
        return []
    }
  }

  set currentValue (currentValue = []) {
    const { currentType } = this
    switch (currentType) {
      case 'dayOfWeek':
        this.dayOfWeek = currentValue
        break
      case 'everyDay':
        return this.useEveryDay()
      case 'dayOfMonth':
        this.dayOfMonth = currentValue
        break
      default:
        break
    }
  }

  serialize () {
    return this.cron
  }

  humanize () {
    const { isEveryDay, isDayOfWeek, isDayOfMonth } = this
    if (isEveryDay) {
      return this._humanizeToEveryDay()
    }

    if (isDayOfWeek) {
      return this._humanizeToDayOfWeek()
    }

    if (isDayOfMonth) {
      return this._humanizeToDayOfMonth()
    }
  }

  _humanizeToDayOfMonth () {
    const { dayOfMonth } = this._split()
    if (dayOfMonth.length === 31) {
      return this._humanizeToEveryDay()
    } else {
      return `每月${
        dayOfMonth.join('、')
      }`
    }
  }

  _humanizeToDayOfWeek () {
    const { dayOfWeek } = this._split()
    if (dayOfWeek.length === 7) {
      return this._humanizeToEveryDay()
    } else {
      return `每周${
        dayOfWeek
          .map(el => CronModel.dayOfWeekMapping.get(~~el))
          .join('、')
      }`
    }
  }

  _humanizeToEveryDay () {
    return '每天'
  }
}
