import axios from 'axios'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

class AdaptorPlusConfig {
  constructor ({
    // 发送方式
    sendType = '',
    address = '',
    args = '',
    back = ''
  }) {
    this.sendType = sendType
    this.address = address
    this.args = args
    this.back = back
  }

  getOption () {
    return { ...this }
  }

  get isAvailable () {
    return !!this.address
  }
  // 计算表达式的值
  evil (fn) {
    const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
    return new Fn('return ' + fn)()
  }

  fetch () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    const { address, args, sendType, back } = this.getOption()
    let obj
    try {
      obj = JSON.parse(args)
    } catch (e) {
      obj = {}
    }
    const params = 'function fun (parm) {' + back + '}'
    switch (sendType) {
      case 'get':
        return axios.get(address, { headers: { ACCESS_TOKEN: 'Bearer ' + token } }).then(({ data }) => {
          this.evil(params)
          // 调用生成的方法处理
          // eslint-disable-next-line no-undef
          console.log('执行到处理阶段', data, fun(data))
          // eslint-disable-next-line no-undef
          return fun(data)
        })
      case 'post':
        return axios.post(address, obj, { headers: { ACCESS_TOKEN: 'Bearer ' + token } })
      default:
        throw new Error('发送方式不对')
    }
    // return axios.post(address, obj, {
    //   headers: {
    //     'Content-type': 'application/json'
    //   }
    // })
    //   .then(({ data }) => data || [])
  }
}

export { AdaptorPlusConfig }
