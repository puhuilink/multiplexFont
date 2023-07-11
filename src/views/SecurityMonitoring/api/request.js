import axios from 'axios'

// 创建axios的对象
const instance = axios.create({
  timeout: 6000
})

// 请求拦截
// 所有的网络请求都会走这个方法,可以在请求添加自定义内容
instance.interceptors.request.use(
  function (config) {
    // || 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6IntcIngtaGFzdXJhLWRlZmF1bHQtcm9sZVwiOlwiYWRtaW5cIixcIngtaGFzdXJhLWFsbG93ZWQtcm9sZXNcIjpbXCJlZGl0b3JcIixcInVzZXJcIixcImFkbWluXCJdfSIsImlzcyI6ImF1dGgwIiwiZXhwIjoxNjg3NzYzMDQ1LCJpYXQiOjE2ODc2OTEwNDUsInVzZXJJZCI6Im5sM3VvTWt1SUgzbE5aNHEyYVJZYVE9PSJ9.iC1qPMasu9bZkpCo4LNhhhtNj_dAr2wMkPFLUUabLSo'
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
  },
  function (err) {
    return Promise.request(err)
  }
)

// 响应拦截
// 此处可以根据服务器返回的状态码做相应的数据
instance.interceptors.response.use(
  function (response) {
    const res = response
    if (res.status === 500) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('error')
    } else if (res.errno === 502) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('error')
    }
    return Promise.resolve(response)
  },
  function (err) {
    return Promise.reject(err)
  }
)

// 封装get和post请求
export function get (url, params) {
  return instance.get(url, { params })
}

export function post (url, data) {
  return instance.post(url, data)
}

export default instance
