import _ from 'lodash'

function buildChildren (parent, collection = []) {
  if (parent) {
    parent.scopedSlots = { icon: 'custom' }
    // 当查询了 instanceList 时，一个 model 的 children 可能既包含 model 也包含 instance
    parent.children = [
      ..._.orderBy(parent.instanceList || [], ['order', 'asc']),
      ..._.orderBy(collection.filter(el => el.parentName === parent.name), ['order'], 'asc')
    ]
    parent.children.forEach(el => {
      el.parent = parent
      el.scopedSlots = { icon: 'custom' }
    })
  }
}

function recursiveBuildChildren (parent, collection = []) {
  if (parent) {
    buildChildren(parent, collection)
    parent.children.forEach(el => {
      // buildNode(el)
      recursiveBuildChildren(el, collection)
    })
  }
}

function buildTree (collection = [], rootKeys = ['Ci']) {
  const roots = []
  _.forEach(collection, el => {
    if (roots.length === rootKeys.length) {
      // break
      return false
    }
    rootKeys.includes(el.name) && roots.push(el)
  })
  roots.forEach(el => {
    // buildNode(el)
    recursiveBuildChildren(el, collection)
  })
  return roots
}

function matchNodeTitle ({ name = '' }, value = '') {
  // FIXME: 数据库存在空数据
  return (name || '')
    .toLowerCase()
    .trim()
    .includes(
      value
        .toLowerCase()
        .trim()
    )
}

/**
 * 查询匹配名称的树节点的 name
 * @param {String} name
 * @param {Array<Object>} collection
 * @return {Array<String>}
 */
function search (name = '', collection) {
  if (!name) {
    return
  }
  const matchedNodes = []
  // 如果一个节点匹配条件，其所有父代也被认为匹配条件
  function recursiveMatchParent (node) {
    matchedNodes.push(node)
    node && node.parent && matchedNodes.push(node.parent)
    node && node.parent && node.parent.parent && recursiveMatchParent(node.parent)
  }
  // 扁平化遍历匹配
  // FIXME: model 是一维数组扁平化查询，其下方的 instance 列表需要进入到内部查询
  collection
    .filter(node => {
      if ((matchNodeTitle(node, name))) {
        return true
      }
      if ((node.instanceList || []).find(instance => matchNodeTitle(instance, name))) {
        return true
      }
      // else if (node.children.find(el => el.name.toLowerCase().includes(name.toLowerCase()))) {
      //   return true
      // } else {
      //   return false
      // }
    })
    .forEach(recursiveMatchParent)
  // 去重
  const result = Array.from(
    new Set(matchedNodes.map(node => node.name))
  )
  return result
}

function flatChildrenNameList (node) {
  const nameList = [];
  (function recursive (el) {
    nameList.push(el['name'])
    if (el.children && el.children.length) {
      // debugger
      el.children.forEach(recursive)
    }
  }(node))
  return nameList
}

export {
  buildTree,
  search,
  flatChildrenNameList
}
