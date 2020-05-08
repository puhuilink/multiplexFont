import store from '@/store'
import colors from 'colors'

colors.enable()
const { getters } = store

const moduleName = function (value) {
  return function testable (target) {
    target.moduleName = value
  }
}

/**
 * 类方法中文标签
 * @param {String} value
 * @return {Function<Decorator>}
 */
const log = function (value = '') {
  return function (target, name, descriptor) {
    // 编译时
    const { value: originalValue } = descriptor

    descriptor.value = function () {
      // 运行时
      const { moduleName } = target
      const { userId } = getters
      console.log(
        colors.red(`${moduleName}: ${userId} 执行了 ${value}, 参数：`, ...Array.from(arguments))
      )
      return originalValue.apply(this, arguments)
    }

    return descriptor
  }
}

export {
  log,
  moduleName
}
