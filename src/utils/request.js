// import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 50000
})

service.interceptors.request.use(config => {
  // const token = Vue.ls.get(ACCESS_TOKEN)
  // if (token) {
  //   config.headers[ACCESS_TOKEN] = 'Bearer ' + token
  // }
  config.headers[ACCESS_TOKEN] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6IntcIngtaGFzdXJhLWRlZmF1bHQtcm9sZVwiOlwiYWRtaW5cIixcIngtaGFzdXJhLWFsbG93ZWQtcm9sZXNcIjpbXCJlZGl0b3JcIixcInVzZXJcIixcImFkbWluXCJdfSIsImlzcyI6ImF1dGgwIiwiZXhwIjoxNTg3NDM5NzkyLCJpYXQiOjE1ODczNjc3OTIsInVzZXJJZCI6ImFkbWluaXN0cmF0b3IifQ.z5_GXOTdh3e4R0cUThH4PgGLexRvlb5tUtaOojIrdhE'
  return config
})

service.interceptors.response.use((response) => {
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
})

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
