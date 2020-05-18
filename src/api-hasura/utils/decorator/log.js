/**
 * https://es6.ruanyifeng.com/#docs/decorator
 */
import store from '@/store'
import colors from 'colors'
import moment from 'moment'
import { isPromise } from '@/utils/util'
// import { axios } from '@/utils/request'

colors.enable()
const { getters } = store

/**
 * 审计
 */
const makeAudit = function (moduleName, actionname, argus) {
  const { userId } = getters

  return {
    userId,
    operationTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    moduleName,
    actionname,
    content: `执行了${actionname}: ${JSON.stringify(argus)}`
  }
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
      const { moduleName } = target
      const result = originalValue.apply(this, arguments)
      if (isPromise(result)) {
        return result
          .then(r => {
            console.log(makeAudit(moduleName, actionname, Array.from(arguments)))
            return r
          })
      } else {
        console.log(makeAudit(moduleName, actionname, Array.from(arguments)))
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
          console.log(makeAudit(moduleName, actionname, Array.from(arguments)))
          return r
        })
    } else {
      console.log(makeAudit(moduleName, actionname, Array.from(arguments)))
      return result
    }
  }
}

export {
  actionname,
  moduleName,
  wrapperLogFunc
}
