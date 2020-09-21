import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_MAIN_BASE_URL
  // timeout: 500000
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
  if (code && code !== 200) {
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

export const imp = axios.create({
  baseURL: process.env.VUE_APP_API_IMP_BASE_URL
  // timeout: 500000
})

service.interceptors.request.use(requestInterceptor)
imp.interceptors.request.use(requestInterceptor)

service.interceptors.response.use(responseInterceptor)
imp.interceptors.response.use(responseInterceptor)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
