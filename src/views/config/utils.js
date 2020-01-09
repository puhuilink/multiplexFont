function buildChildren (parent, collection = []) {
  if (parent.key === 'BJDC') {
  }
  parent.children = collection.filter(el => el.parentKey === parent.key)
}

function recursiveBuildChildren (parent, collection = []) {
  buildChildren(parent, collection)
  parent.children.forEach(el => recursiveBuildChildren(el, collection))
}

function buildTree (collection = []) {
  const root = collection.find(el => el.key === 'Ci')
  recursiveBuildChildren(root, collection)
  return [root]
}

export {
  buildTree
}
