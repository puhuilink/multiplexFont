import store from '@/store'
import colors from 'colors'

colors.enable()
const { getters } = store

/**
 * 类方法中文标签
 * @param {String} value
 * @return {Function<Decorator>}
 */
const label = function (value = '') {
  return function (target, name, descriptor) {
    Object.defineProperty(descriptor, 'label', {
      get () {
        return value
      }
    })
  }
}

/**
 * 记录经由接口进行的操作，后期可扩展到数据库日志
 * @param {*} target
 * @param {*} name
 * @param {*} descriptor
 * @return {any}
 */
const log = function (target, name, descriptor) {
  // 编译时
  const { value: originalValue } = descriptor

  descriptor.value = function () {
    // 运行时
    const { userId } = getters
    const { label } = descriptor
    console.log(
      colors.red(`log：${userId} 执行了 ${label}, 参数：`, ...Array.from(arguments))
    )
    return originalValue.apply(this, arguments)
  }

  return descriptor
}

export {
  label,
  log
}
