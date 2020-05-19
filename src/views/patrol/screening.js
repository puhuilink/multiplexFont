const ascriptionList = [
  {
    label: '北京机房',
    value: 'MachineRoom-BJ'
  },
  {
    label: '厦门数据中心',
    value: 'MachineRoom-XM',
    children: [
      {
        label: '厦门IT机房',
        value: 'MachineRoom-XM-IT'
      },
      {
        label: '厦门动环机房',
        value: 'MachineRoom-XM-DH'
      }
    ]
  }
]
const planTypeList = [
  {
    code: 'A',
    name: '例行巡更'
  },
  {
    code: 'B',
    name: '临时巡更'
  }
]
const enableList = [
  {
    code: 0,
    name: '否'
  },
  {
    code: 1,
    name: '是'
  }
]
const taskStatusList = [
  {
    type: 'A',
    label: '未执行'
  },
  {
    type: 'B',
    label: '已下载'
  },
  {
    type: 'D',
    label: '已完成'
  },
  {
    type: 'E',
    label: '超时完成'
  },
  {
    type: 'F',
    label: '失败'
  }
]

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
  ascriptionList,
  planTypeList,
  enableList,
  taskStatusList,
  createUniqueId
}
