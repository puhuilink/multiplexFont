const requirePlugins = require.context('./', true, /\.js$/)

const excludeList = [
  './index.js',
  './BaseService.js'
]

const exposed = {}

requirePlugins.keys().forEach((fileName) => {
  if (excludeList.includes(fileName)) return
  const className = fileName.replace(/(\.)*(\/)*(js)*/g, '')
  exposed[className] = requirePlugins(fileName)[className]
})

module.exports = exposed
