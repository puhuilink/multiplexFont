function buildChildren (parent, collection = []) {
  if (parent) {
    parent.children = collection.filter(el => el.parentKey === parent.key)
    parent.children.forEach(el => {
      el.parent = parent
    })
  }
}

function recursiveBuildChildren (parent, collection = []) {
  if (parent) {
    buildChildren(parent, collection)
    parent.children.forEach(el => recursiveBuildChildren(el, collection))
  }
}

function buildTree (collection = []) {
  const root = collection.find(el => el.key === 'Ci')
  if (root) {
    recursiveBuildChildren(root, collection)
    return [root]
  } else {
    return []
  }
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
    node && node.parent && node.parent.parent && recursiveMatchParent(node.pareny)
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
