import _ from 'lodash'
import scrollTo from 'ant-design-vue/lib/_util/scrollTo'

export {
  scrollTo
}

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['欢迎词', '欢迎词', '欢迎词', '欢迎词']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 下载文件
 * @param fileName 文件名
 * @param content 文本内容
 */
export function downloadFile (fileName, content) {
  const link = document.createElement('a')
  const blob = new Blob([content])
  link.download = fileName
  link.href = URL.createObjectURL(blob)
  const event = document.createEvent('MouseEvents')
  event.initMouseEvent('click', false, false)
  link.dispatchEvent(event)
}

/**
 * 生成number格式的uuid，主要用于数据表新增项的id
 * @param {*} length
 */
export function numbericUuid (length) {
  return new Date().valueOf() * 1000 + parseInt(Math.random() * 1000)
}

export function varcharUuid (length) {
  return `${numbericUuid()}`
}

/**
 * 由原始权限列表，构建菜单级别权限树
 */
export function getMenuTree (tree, list) {
  if (!tree) {
    tree = {
      code: 'F',
      key: 'F'
    }
  }
  const childrenList = list.filter(child => child.parentCode === tree.code)
  if (childrenList.length > 0) {
    tree.children = []
    childrenList.map(item => {
      item.key = item.code
      getMenuTree(item, list)
      return item
    })
    tree.children = childrenList
  }
  return tree
}

/**
 * 由原始权限列表，构建菜单级别权限树
 */
export function getButtonTree (tree, list) {
  if (!tree) {
    tree = {
      code: 'M',
      key: 'M'
    }
  }
  const childrenList = list.filter(child => child.parentCode === tree.code)
  if (childrenList.length > 0) {
    tree.children = []
    childrenList.map(item => {
      item.key = item.code
      item.title = item.name
      getButtonTree(item, list)
      return item
    })
    tree.children = childrenList
  }
  return tree
}

// 全部视图权限
let allPermission = []
/**
 * 由原始权限列表，分离菜单权限数组，构建菜单树
 */
export function getTree (tree, list, buttonTree) {
  if (!tree) {
    tree = {
      code: 'F'
    }
  }
  const childrenList = list.filter(child => child.parentCode === tree.code)
  if (childrenList.length > 0) {
    tree.permissions = []
    childrenList.map(item => {
      const actions = buttonTree.children.find(button => button.name === (item.name || ''))
      if (actions) {
        // hack
        actions.children = actions.children || []
        item.actionEntitySet = actions.children
        item.actionList = actions.children.map(action => action.code)
        item.permissionId = item.code
        item.permissionName = item.name
      }
      getTree(item, list, buttonTree)
      return item
    })
    tree.permissions = childrenList
    tree.permissionList = childrenList.map(item => item.code)
    tree.allPermission = allPermission = [...allPermission, ...tree.permissionList]
  }
  return tree
}

/**
 * 将菜单树与按钮树合并
 * @param menuTree
 * @param buttonTree
 */
export function mergePermission (menuTree, buttonTree) {
  if (menuTree.children && menuTree.children.length > 0) {
    menuTree.children.map(item => {
      const action = buttonTree.children.find(button => button.name === (item.name || ''))
      if (action) {
        item.action = action
      }
      mergePermission(item, buttonTree)
      return item
    })
  }
  return menuTree
}

export function isPromise (obj) {
  return (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

export function filterTransferOption (key) {
  return function (inputValue = '', option) {
    const value = _.get(option, key, '')
    return value.toLowerCase().indexOf(
      inputValue.trim().toLowerCase()
    ) > -1
  }
}
