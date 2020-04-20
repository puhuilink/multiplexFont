import store from '@/store'

const { getters } = store

/**
 * 类方法中文标签
 * @param {String} value
 */
export const label = function (value = '') {
  return function (target, name, descriptor) {
    Object.defineProperty(descriptor, 'label', {
      get () {
        return value
      }
    })
  }
}

export const log = function (target, name, descriptor) {
  // 编译时
  const { value: originalValue } = descriptor

  descriptor.value = function () {
    // 运行时
    const { userId } = getters
    const { label } = descriptor
    console.log(`${userId} 执行了 ${label}, 参数：`, ...Array.from(arguments))
    return originalValue.apply(this, arguments)
  }

  return descriptor
}
