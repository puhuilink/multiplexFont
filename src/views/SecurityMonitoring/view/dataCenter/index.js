import axios from 'axios'
const instance = axios.create({
  timeout: 6000
})
// 封装get和post请求
export function get (url, params) {
  return instance.get(url, { params })
}

export function post (url, data) {
  return instance.post(url, data)
}

export default instance
