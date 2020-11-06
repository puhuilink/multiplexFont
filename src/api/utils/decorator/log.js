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
 * FIXME: handle empty Array.from(arguments)
 */
const makeAudit = async function (moduleName = '', actionname = '', argus = []) {
  const { userId } = getters

  if (!userId) return

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
const moduleName = function (_moduleName = '') {
  return function (target) {
    target.moduleName = _moduleName
  }
}

/**
 * 模块下操作名
 */
const actionname = function (_actionname = '') {
  return function (target, name, descriptor) {
    // 编译时
    const { value: originalValue } = descriptor

    descriptor.value = function () {
      // 运行时
      const result = originalValue.apply(this, arguments)
      if (isPromise(result)) {
        return result
          .then(r => {
            makeAudit(target.moduleName, _actionname, Array.from(arguments))
            return r
          })
      } else {
        makeAudit(target.moduleName, _actionname, Array.from(arguments))
        return result
      }
    }

    return descriptor
  }
}

export {
  actionname,
  moduleName
}
