/**
 * https://es6.ruanyifeng.com/#docs/decorator
 */
import store from '@/store'
import colors from 'colors'
import { isPromise } from '@/utils/util'
import { axios } from '@/utils/request'

colors.enable()
const { getters } = store

/**
 * 接口写入审计日志
 */
const makeAudit = async function (moduleName, actionname, argus) {
  const { userId } = getters

  const data = {
    userId,
    moduleName,
    actionname,
    content: `${userId}执行了${actionname}: ${JSON.stringify(argus)}`
  }

  await axios.post('/audit/add', data, {
    // 无论成功或失败应该静默请求，用户无感知
    validateStatus: () => true
  })
}

/**
 * 模块名
 */
const moduleName = function (value) {
  return function testable (target) {
    target.moduleName = value
  }
}

/**
 * 模块下操作名
 */
const actionname = function (value = '') {
  return function (target, name, descriptor) {
    // 编译时
    const { value: originalValue } = descriptor

    descriptor.value = async function () {
      // 运行时
      const result = originalValue.apply(this, arguments)
      console.log(Array.from(arguments))
      if (isPromise(result)) {
        return result
          .then(r => {
            makeAudit(target.moduleName, value, Array.from(arguments))
            return r
          })
      } else {
        makeAudit(target.moduleName, value, Array.from(arguments))
        return result
      }
    }

    return descriptor
  }
}

/**
 * 对未采用 class 方式的函数进行装饰器修饰
 */
const wrapperLogFunc = function (func, moduleName, actionname) {
  return function () {
    const result = func.apply(this, arguments)

    if (isPromise(result)) {
      return result
        .then(r => {
          makeAudit(moduleName, actionname, Array.from(arguments))
          return r
        })
    } else {
      makeAudit(moduleName, actionname, Array.from(arguments))
      return result
    }
  }
}

export {
  actionname,
  moduleName,
  wrapperLogFunc
}
