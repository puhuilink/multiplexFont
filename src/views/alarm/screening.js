// 级别列表
const levelList = {
  0: {
    level: 'L1',
    text: 'INFO'
  },
  1: {
    level: 'L2',
    text: 'WARNING'
  },
  2: {
    level: 'L3',
    text: 'MINOR'
  },
  3: {
    level: 'L4',
    text: 'MAJOR'
  },
  4: {
    level: 'L5',
    text: 'CRITICAL'
  }
}

const forwardType = [
  {
    value: 'EOMS',
    label: '运维系统'
  },
  {
    value: 'Email',
    label: '邮件'
  },
  {
    value: 'SMS',
    label: '短信'
  }
]

// 告警状态列表
const stateList = [
  {
    value: 0,
    label: '新产生'
  },
  {
    value: 5,
    label: '已确认'
  },
  {
    value: 10,
    label: '处理中'
  },
  {
    value: 20,
    label: '已处理'
  },
  {
    value: 30,
    label: '已忽略'
  }
]
// 告警级别列表
const severityList = [
  {
    value: 0,
    level: 'L1',
    text: 'INFO'
  },
  {
    value: 1,
    level: 'L2',
    text: 'WARNING'
  },
  {
    value: 2,
    level: 'L3',
    text: 'MINOR'
  },
  {
    value: 3,
    level: 'L4',
    text: 'MAJOR'
  },
  {
    value: 4,
    level: 'L5',
    text: 'CRITICAL'
  }
]
/**
 * 获得今天的日期 yyyy-mm-dd
 */
function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

/**
 * 生成唯一id
 */
function createUniqueId () {
  const unx = Date.now()
  const length = 16 - unx.toString().length
  if (length > 0) {
    var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var nums = ''
    for (var i = 0; i < length; i++) {
      var r = parseInt(Math.random() * 10)
      nums += data[r]
    }
    return unx + nums
  } else {
    return false
  }
}

export default {
  levelList,
  forwardType,
  getNowFormatDate,
  stateList,
  severityList,
  createUniqueId
}
