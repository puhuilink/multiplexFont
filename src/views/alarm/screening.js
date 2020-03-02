// 筛选项：CI域
const CIDomain = [
  {
    label: 'Root',
    options: [{
      value: 'rootDamin',
      label: 'rootDamin'
    }]
  }, {
    label: 'rootDamin',
    options: [{
      value: 'bj',
      label: '北京运维组'
    },
    {
      value: 'xm',
      label: '厦门运维组'
    }]
  }
]

// 筛选项：CI类型
const CIType = [
  {
    label: 'Root',
    options: [{
      value: '0',
      label: '统一资源'
    }]
  },
  {
    label: 'CI',
    options: [{
      value: '1',
      label: '管理'
    },
    {
      value: '2',
      label: '监控定义'
    },
    {
      value: '3',
      label: '监控对象'
    },
    {
      value: '4',
      label: '告警'
    },
    {
      value: '5',
      label: '性能'
    }]
  },
  {
    label: 'Manager',
    options: [{
      value: '6',
      label: '字典数据'
    }]
  }
]

// 筛选项 CI实例
const CIInstance = [
  {
    label: 'Root',
    options: [{
      value: '1',
      label: '统一资源'
    }]
  },
  {
    label: 'CI',
    options: [{
      value: '2',
      label: '管理'
    },
    {
      value: '3',
      label: '监控定义'
    },
    {
      value: '4',
      label: '监控对象'
    },
    {
      value: '5',
      label: '告警'
    },
    {
      value: '6',
      label: '性能'
    }]
  },
  {
    label: 'Manager',
    options: [{
      value: '7',
      label: '字典数据'
    }]
  }
]

// 筛选项: CI名称
const CIName = [
  {
    label: 'Root',
    options: [{
      value: '1',
      label: '统一资源'
    }]
  },
  {
    label: 'CI',
    options: [{
      value: '2',
      label: '管理'
    },
    {
      value: '3',
      label: '监控定义'
    },
    {
      value: '4',
      label: '监控对象'
    },
    {
      value: '5',
      label: '告警'
    },
    {
      value: '6',
      label: '性能'
    }]
  },
  {
    label: 'Manager',
    options: [{
      value: '7',
      label: '字典数据'
    }]
  }
]

// 告警类型
const alarmType = [
  {
    label: 'Root',
    options: [{
      value: '1',
      label: '统一资源'
    }]
  },
  {
    label: 'CI',
    options: [{
      value: '2',
      label: '管理'
    },
    {
      value: '3',
      label: '监控定义'
    },
    {
      value: '4',
      label: '监控对象'
    },
    {
      value: '5',
      label: '告警'
    },
    {
      value: '6',
      label: '性能'
    }]
  },
  {
    label: 'Manager',
    options: [{
      value: '7',
      label: '字典数据'
    }]
  }
]

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
  '运维系统', '邮件', '短信'
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
 * 选择框全选(适用于分组选择器)
 */
function checkAll (arr, modelList) {
  // arr:change中的数组 ，  modelList:下拉框List
  const length = arr.length
  let list = arr
  arr.forEach(element => {
    // 当数组中存在checkall，说明此时进行全选/取消全选
    if (element === 'checkall') {
      // 当数组长度为最大长度且最后一个元素为checkall时，说明此时在全选的基础上又点击全选，则取消全选
      if (length - 1 === modelList.length && arr[length - 1] === 'checkall') {
        list = []
      } else {
        // 当不是取消全选操作，只要数组中出现了checkall则说明进行了全选操作
        list = []
        modelList.forEach(m => {
          for (const i in m.options) {
            list.push(m.options[i].value)
          }
        })
      }
    }
  })
  return list
}

export default {
  CIDomain,
  CIType,
  CIInstance,
  CIName,
  alarmType,
  levelList,
  forwardType,
  getNowFormatDate,
  checkAll
}
