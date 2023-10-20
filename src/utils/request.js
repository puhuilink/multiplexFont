import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { encrypt, decrypt } from '@/utils/aes'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
  // timeout: 500000
})

const serviceZhenhua = axios.create({
  baseURL: process.env.VUE_APP_API_ZHENHUA_BASE_URL
})

const serviceXungeng = axios.create({
  baseURL: process.env.VUE_APP_XUNJIAN_API_BASE_URL
})

const serviceSdwan = axios.create({
  baseURL: process.env.VUE_APP_SDWAN_ORIGINAL_URL
})

const serviceCorp = axios.create({
  baseURL: process.env.VUE_APP_MV_API_BASE_URL
})

const serviceAlarm = axios.create({
  baseURL: process.env.VUE_APP_ALARM_BASE_URL
})

const over = axios.create({
  baseURL: process.env.VUE_APP_ECHARTS_URL
})

const sql = async (s) => {
  const payload = {
    type: 'bulk',
    args: [
      {
        type: 'run_sql',
        args: {
          read_only: false,
          cascade: false,
          sql: s
        }
      }
    ]
  }

  const formData = new FormData()
  formData.append('body', encrypt(JSON.stringify(payload)))

  const { data } = await serviceXungeng.post('/Hasura/query', formData, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
  try {
    if (decrypt(data) === '') {
      return []
    }
    const list = JSON.parse(decrypt(data))
    if (list.length) {
      const [{ result }] = list
      return result
    }
    return []
  } catch (e) {
    // throw new Error(e)
    return []
  }
}

const requestInterceptor = config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ACCESS_TOKEN] = 'Bearer ' + token
  }
  return config
}

const requestOverInterceptor = config => {
  config.headers['NGSOC-Access-Token'] = 'bfaab4f4d8704d99b04231ad26862f6d23673efa99bcf90914ccad2a9d3683e5'
  console.log(config.headers)
  return config
}

const responseInterceptor = (response) => {
  const { data: { code, msg } } = response
  // hack: 30 代表查询到未匹配内容
  if (code && code !== 200) {
    switch (code) {
      case 401: {
        notification.error({
          message: '登录已过期',
          description: '请重新登录'
        })
        break
      }
      case 30: {
        notification.error({
          message: msg,
          description: '请重新登录'
        })
        this.$router.push('/user/login')
        location.reload()
        throw new Error(msg)
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

const secondResponseInterceptor = (response) => {
  const { data: { code, msg } } = response
  // hack: 30 代表查询到未匹配内容
  if (code && code !== 200) {
    switch (code) {
      case 401: {
        notification.error({
          message: '登录已过期',
          description: '请重新登录'
        })
        break
      }
      case 30: {
        throw new Error(msg)
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

const xungengresponseInterceptor = (response) => {
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

serviceCorp.interceptors.request.use(requestInterceptor)

serviceCorp.interceptors.response.use(responseInterceptor)

serviceZhenhua.interceptors.request.use(requestInterceptor)

serviceZhenhua.interceptors.response.use(secondResponseInterceptor)

serviceSdwan.interceptors.request.use(requestInterceptor)

serviceSdwan.interceptors.response.use(responseInterceptor)

serviceXungeng.interceptors.request.use(requestInterceptor)

serviceXungeng.interceptors.response.use(xungengresponseInterceptor)

serviceAlarm.interceptors.request.use(requestInterceptor)

serviceAlarm.interceptors.response.use(secondResponseInterceptor)

over.interceptors.request.use(requestOverInterceptor)

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
  serviceXungeng as xungeng,
  serviceZhenhua as zhenhua,
  serviceSdwan as sdwan,
  serviceCorp as crop,
  serviceAlarm as alarm,
  sql,
  over
}
