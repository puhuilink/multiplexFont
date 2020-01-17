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

export default {
  CIDomain,
  CIType,
  CIInstance,
  CIName,
  alarmType,
  levelList
}
