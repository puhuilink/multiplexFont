import moment from 'moment'

export const compare = (a = moment().format(), b = moment().format()) => {
  let aTime = a
  let bTime = b

  // hack: 缺少日期时无法直接比较小时
  if (aTime.length === 8 && aTime.split(':').length === 3) {
    aTime = `2020-01-14 ${aTime}`
  }

  if (bTime.length === 8 && bTime.split(':').length === 3) {
    bTime = `2020-01-14 ${bTime}`
  }

  if (moment(aTime).isBefore(bTime)) return -1
  if (moment(aTime).isAfter(bTime)) return 1
  return 0
}
