/**
 * @abort
 * @param {*} node
 */
// eslint-disable-next-line
function buildNode (node) {
  if (node && node.instanceList) {
    const count = node.instanceList.aggregate.count
    node.title += count ? `(${count})` : ''
  }
}

function buildChildren (parent, collection = []) {
  if (parent) {
    // 当 model 下存在 instance 列表时，其 children 在查询时已经挂载
    parent.children = (parent.children && parent.children.length) ? parent.children : collection.filter(el => el.parentKey === parent.key)
    // parent.children = collection.filter(el => el.parentKey === parent.key)
    parent.children.forEach(el => {
      el.parent = parent
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

// TODO: 节点筛选出来后，slice 处理数组，加快下次遍历
function buildTree (collection = [], rootKeys = ['Ci']) {
  const roots = []
  collection.forEach(el => {
    rootKeys.forEach((key, index) => {
      if (el.key === key) {
        roots.push(el)
        // 找到后弹出
        // TODO: 是否会影响长度，或者用逆序？
        // TODO: 匹配完成后跳出循环
        // rootKeys.splice(index, 1)
      }
    })
  })
  roots.forEach(el => {
    // buildNode(el)
    recursiveBuildChildren(el, collection)
  })
  return roots
}

/**
 * 查询匹配名称的树节点的 key
 * @param {String} title
 * @param {Array<Object>} collection
 * @return {Array<String>}
 */
function search (title = '', collection) {
  const matchedNodes = []
  // 如果一个节点匹配条件，其所有父代也被认为匹配条件
  function recursiveMatchParent (node) {
    node && node.parent && matchedNodes.push(node.parent)
    node && node.parent && node.parent.parent && recursiveMatchParent(node.parent)
  }
  // 扁平化遍历匹配
  collection
    .filter(node => node.title.toLowerCase().includes(title.toLowerCase()))
    .forEach(recursiveMatchParent)
  // 去重
  const result = Array.from(
    new Set(matchedNodes.map(node => node.key))
  )
  return result
}

export {
  buildTree,
  search
}
