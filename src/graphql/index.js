// TODO: 自动 export
const requireControllers = require.context('./controller', true, /\.js$/)

requireControllers.keys().forEach((fileName) => {
  if (fileName === './index.js') return
  requireControllers(fileName)
})
