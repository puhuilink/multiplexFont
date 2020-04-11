import apollo from '@/utils/apollo'
import moment from 'moment'
import { queryByBaselineDefIdAndDateRange, mutationInsertCalendars } from '../graphql/BaselineCalendar'
import Timeout from 'await-timeout'
import uuid from 'uuid/v4'

/**
 * @param {String} baselineDefId 动态基线定义 id
 * @param {Moment} month 月份 格式：YYYY-MM
 * @return {Promise<any>}
 */
export const getBaselineCalendar = async function (baselineDefId, month) {
  // month 为空默认返回当月
  const calendarStart = moment(month).startOf('month').format('YYYY-MM-DD')
  const calendarEnd = moment(month).endOf('month').format('YYYY-MM-DD')
  const startDay = Number(moment(month).startOf('month').format('DD'))
  const endDay = Number(moment(month).endOf('month').format('DD'))

  console.log(startDay, endDay)
  const defaultCalendar = []

  for (let m = moment(calendarStart); m.isSameOrBefore(moment(calendarEnd)); m.add(1, 'days')) {
    defaultCalendar.push(
      m.format('YYYY-MM-DD')
    )
  }

  try {
    let result = []
    if (baselineDefId) {
      result = await apollo.clients.alert.query({
        query: queryByBaselineDefIdAndDateRange,
        variables: {
          baselineDefId,
          calendarStart,
          calendarEnd
        }
      }).then(r => r.data.data)
    } else {
      // 显式返回 promise
      await Timeout.set()
    }
    // 如果查询数据为空，需要给定初始值
    for (let i = 0; i <= endDay - startDay; i++) {
      // 与接口返回数据格式保持一致
      result[i] = result[i] || {
        // 1代表库数据，0代表默认数据？
        status: 0,
        // 默认是 10天？
        'cycle_info': null,
        // 'cycle_info': '30（天）',
        calendar: defaultCalendar[i]
      }
    }
    return result
  } catch (e) {
    throw e
  }
}

export const updateBaselineCalendar = async function (baselineDefId, calendar) {

}

export const addBaselineCalendar = async function (baselineDefId, calendarList) {
  const objects = calendarList.map(calendar => ({
    ...calendar,
    'uuid_def': baselineDefId,
    // 控制长度在33之内（与数据表保持一致）
    uuid: uuid().replace(/-/g, ''),
    status: 1,
    'update_time': moment().format('YYYY-MM-DDTHH:mm:ss')
  }))
  return apollo.clients.alert.mutate({
    mutation: mutationInsertCalendars,
    variables: {
      objects
    }
  })
}
