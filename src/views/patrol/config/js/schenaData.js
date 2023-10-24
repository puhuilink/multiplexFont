import _ from 'lodash'

const zoneForm = {
  pathId: '',
  zoneId: '',
  zoneAlias: ''
}
const checkpointForm = {
  pathId: '',
  checkpointId: '',
  checkpointAlias: ''
}
const hostForm = {
  pathId: '', // 必传
  hostId: '', // 必传
  hostAlias: '', // 必传
  cantainer: '', // 非必传
  hostType: '', // 非必传
  hostBrand: '', // 非必传
  ipAddress: '', // 非必传
  sn: '', // 非必传
  hostBelong: ''// 非必传
}
const endpointForm = {
  pathId: '',
  endpointId: '',
  endpointAlias: ''
}
const metricForm = {
  pathId: '',
  metricId: '',
  metricAlias: '',
  answerId: ''
}
const newZoneForm = {
  pathId: '',
  zoneAlias: '',
  checkpointAlias: '',
  hostAlias: '',
  cantainer: '',
  hostType: '',
  hostBrand: '',
  ipAddress: '',
  sn: '',
  hostBelong: '',
  endpointAlias: '',
  metricAlias: '',
  answerId: ''
}
const newCheckpointForm = {
  pathId: '',
  zoneId: '',
  zoneAlias: '',
  checkpointAlias: '',
  hostAlias: '',
  cantainer: '',
  hostType: '',
  hostBrand: '',
  ipAddress: '',
  sn: '',
  hostBelong: '',
  endpointAlias: '',
  metricAlias: '',
  answerId: ''
}
const newHostForm = {
  pathId: '', // 必传
  zoneId: '',
  zoneAlias: '',
  checkpointId: '',
  checkpointAlias: '',
  hostAlias: '',
  cantainer: '',
  hostType: '',
  hostBrand: '',
  ipAddress: '',
  sn: '',
  hostBelong: '',
  endpointAlias: '',
  metricAlias: '',
  answerId: ''
}
const newEndpointForm = {
  pathId: '',
  zoneId: '',
  zoneAlias: '',
  checkpointId: '',
  checkpointAlias: '',
  hostId: '',
  hostAlias: '',
  cantainer: '',
  hostType: '',
  hostBrand: '',
  ipAddress: '',
  sn: '',
  hostBelong: '',
  endpointAlias: '',
  metricAlias: '',
  answerId: ''
}
const newMetricForm = {
  pathId: '',
  zoneId: '',
  zoneAlias: '',
  checkpointId: '',
  checkpointAlias: '',
  hostId: '',
  hostAlias: '',
  cantainer: '',
  hostType: '',
  hostBrand: '',
  ipAddress: '',
  sn: '',
  hostBelong: '',
  endpointId: '',
  endpointAlias: '',
  metricAlias: '',
  answerId: ''
}
const deleteForm = {
  pathId: '',
  zoneId: '',
  checkpointId: '',
  hostId: '',
  endpointId: '',
  metricAlias: '',
  answerId: ''
}
const operationMap = {
  editZone: [
    // zone
    { edit: true, required: true, show: false },
    // checkpoint
    { edit: false, required: false, show: false },
    // host
    { edit: false, required: false, show: false },
    // endpoint
    { edit: false, required: false, show: false },
    // metric
    { edit: false, required: false, show: false }
  ],
  editPoint: [
    // zone
    { edit: false, required: false, show: false },
    // checkpoint
    { edit: true, required: true, show: false },
    // host
    { edit: false, required: false, show: false },
    // endpoint
    { edit: false, required: false, show: false },
    // metric
    { edit: false, required: false, show: false }
  ],
  editHost: [
    // zone
    { edit: false, required: false, show: false },
    // checkpoint
    { edit: false, required: false, show: false },
    // host
    { edit: true, required: true, show: false },
    // endpoint
    { edit: false, required: false, show: false },
    // metric
    { edit: false, required: false, show: false }
  ],
  editEndpoint: [
    // zone
    { edit: false, required: false, show: false },
    // checkpoint
    { edit: false, required: false, show: false },
    // host
    { edit: false, required: false, show: false },
    // endpoint
    { edit: true, required: false, show: false },
    // metric
    { edit: false, required: false, show: false }
  ],
  editMetric: [
    // zone
    { edit: false, required: false, show: false },
    // checkpoint
    { edit: false, required: false, show: false },
    // host
    { edit: false, required: false, show: false },
    // endpoint
    { edit: false, required: false, show: false },
    // metric
    { edit: true, required: true, show: false }
  ],
  newZone: [
    // zone
    { edit: true, required: true, show: false },
    // checkpoint
    { edit: true, required: true, show: false },
    // host
    { edit: true, required: true, show: false },
    // endpoint
    { edit: true, required: false, show: false },
    // metric
    { edit: true, required: true, show: false }
  ],
  newPoint: [
    // zone
    { edit: false, required: false, show: true },
    // checkpoint
    { edit: true, required: true, show: false },
    // host
    { edit: true, required: true, show: false },
    // endpoint
    { edit: true, required: false, show: false },
    // metric
    { edit: true, required: true, show: false }
  ],
  newHost: [
    // zone
    { edit: false, required: false, show: true },
    // checkpoint
    { edit: false, required: false, show: true },
    // host
    { edit: true, required: true, show: false },
    // endpoint
    { edit: true, required: false, show: false },
    // metric
    { edit: true, required: true, show: false }
  ],
  newEndpoint: [
    // zone
    { edit: false, required: false, show: true },
    // checkpoint
    { edit: false, required: false, show: true },
    // host
    { edit: false, required: false, show: true },
    // endpoint
    { edit: true, required: false, show: false },
    // metric
    { edit: true, required: true, show: false }
  ],
  newMetric: [
    // zone
    { edit: false, required: false, show: true },
    // checkpoint
    { edit: false, required: false, show: true },
    // host
    { edit: false, required: false, show: true },
    // endpoint
    { edit: false, required: false, show: true },
    // metric
    { edit: true, required: true, show: false }
  ]
}
const titleMap = {
  editZone: '编辑楼层信息',
  editPoint: '编辑点位信息',
  editHost: '编辑设备信息',
  editEndpoint: '编辑检查实体信息',
  editMetric: '编辑检查项信息',
  newZone: '新增楼层及下级数据',
  newPoint: '新增点位及下级数据',
  newHost: '新增设备及下级数据',
  newEndpoint: '新增检查实体及下级数据',
  newMetric: '新增检查项'
}
const formMap = {
  editZone: zoneForm,
  editPoint: checkpointForm,
  editHost: hostForm,
  editEndpoint: endpointForm,
  editMetric: metricForm,
  newZone: newZoneForm,
  newPoint: newCheckpointForm,
  newHost: newHostForm,
  newEndpoint: newEndpointForm,
  newMetric: newMetricForm
}
const takeKeysMap = {
  editZone: ['pathId', 'zoneId', 'zoneAlias'],
  editPoint: ['pathId', 'checkpointId', 'checkpointAlias'],
  editHost: ['pathId', 'hostId', 'hostAlias', 'cantainer', 'hostType', 'hostBrand', 'ipAddress', 'sn', 'hostBelong'],
  editEndpoint: ['pathId', 'endpointId', 'endpointAlias'],
  editMetric: ['pathId', 'metricId', 'metricAlias', 'answerId'],
  newZone: ['pathId'],
  newPoint: [
    'pathId',
    'zoneId',
    'zoneAlias'
  ],
  newHost: [
    'pathId',
    'zoneId',
    'zoneAlias',
    'checkpointId',
    'checkpointAlias'
  ],
  newEndpoint: [
    'pathId',
    'zoneId',
    'zoneAlias',
    'checkpointId',
    'checkpointAlias',
    'hostId',
    'hostAlias',
    'cantainer',
    'hostType',
    'hostBrand',
    'ipAddress',
    'sn',
    'hostBelong'
  ],
  newMetric: [
    'pathId',
    'zoneId',
    'zoneAlias',
    'checkpointId',
    'checkpointAlias',
    'hostId',
    'hostAlias',
    'cantainer',
    'hostType',
    'hostBrand',
    'ipAddress',
    'sn',
    'hostBelong',
    'endpointId',
    'endpointAlias'
  ]
}
// 1) 将字符串转换成驼峰写法
function toHump (str) {
  // 将字符串通过 下划线 拆分成多段 形成一个数组
  var strArr = str.split('_')

  // 将数组中每个元素的第一个字母修改成大写形式
  // charAt(0) 返回该元素的第一个字母 user -> u
  // substring(1) 将字符串从第一个字母开始截取 user -> ser
  for (let i = 1; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1)
  }

  // 数组转换成字符串
  return strArr.join('')
}

// 2) 格式化数组中的对象
function transData (sourceData) {
  return sourceData.map(item => {
    // 准备最后返回的对象
    const obj = {}

    Object.keys(item).forEach(key => {
      // eslint-disable-next-line no-useless-escape
      if (/\_(\w)/.test(key)) {
        // 如果需要转化 则进行驼峰转化
        const _key = toHump(key)
        obj[_key] = item[key]
      } else {
        // 如果不需要直接赋值
        obj[key] = item[key]
      }
    })
    return obj
  })
}

function takeData (operationType, sourceData, targetData) {
  const resultData = transData([sourceData])
  let arr = []
  arr = takeKeysMap[operationType]
  arr.forEach(entity => {
    targetData[entity] = resultData[0][entity]
  })
}
function getDeleteData (row) {
  const deleteData = ['pathId', 'zoneId', 'checkpointId', 'hostId', 'endpointId', 'metricId', 'answerId']
  const df = _.cloneDeep(deleteForm)
  const resultData = transData([row])
  deleteData.forEach(entity => {
    df[entity] = resultData[entity]
  })
  return df
}

export {
  titleMap,
  operationMap,
  formMap,
  takeKeysMap,
  takeData,
  getDeleteData
}
