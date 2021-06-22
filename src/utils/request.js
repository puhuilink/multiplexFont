import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
  // timeout: 500000
})

const serviceXungeng = axios.create({
  baseURL: process.env.VUE_APP_XUNJIAN_API_BASE_URL
})

const requestInterceptor = config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ACCESS_TOKEN] = 'Bearer ' + token
  }
  return config
}

const responseInterceptor = (response) => {
  const { data: { code, msg } } = response
  // hack: 30 代表查询到未匹配内容
  if (code && ![30, 200].includes(code)) {
    switch (code) {
      case 401: {
        notification.error({
          message: '登录已过期',
          description: '请重新登录'
        })
        break
      }
      default: {
        notification.error({
          message: '操作失败',
          description: msg
        })
      }
    }
    return Promise.reject(new Error(msg))
  }
  return response.data
}

const XungengresponseInterceptor = (response) => {
  const { data: { code, msg } } = response
  // hack: 30 代表查询到未匹配内容
  if (code && ![200].includes(code)) {
    switch (code) {
      case 401: {
        notification.error({
          message: '登录已过期',
          description: '请重新登录'
        })
        break
      }
      default: {
        notification.error({
          message: '操作失败',
          description: msg
        })
      }
    }
    return Promise.reject(new Error(msg))
  }
  return response.data
}

service.interceptors.request.use(requestInterceptor)

service.interceptors.response.use(responseInterceptor)

serviceXungeng.interceptors.request.use(XungengresponseInterceptor)

serviceXungeng.interceptors.response.use(XungengresponseInterceptor)

serviceXungeng.defaults.withCredentials = true

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
    Vue.use(VueAxios, serviceXungeng)
  }
}

export {
  installer as VueAxios,
  service as axios,
  serviceXungeng as xungeng
}
