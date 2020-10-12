import { axios } from '@/utils/request'
import Timeout from 'await-timeout'
import { encrypt } from '@/utils/aes'

// TODO: 当前 token 并无过期时间，后端也并未提供 logout 接口
export function logout (token) {
  return Timeout.set()
  // return axios({
  //   url: '/auth/logout',
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json;charset=UTF-8'
  //   }
  // })
}

/**
 * 发送验证码
 * @abort
 * @param data
 * @returns {AxiosPromise}
 */

export const sendCaptchaByUserId = function (userId) {
  const formData = new FormData()
  formData.append('userId', encrypt(userId))
  return axios.post(`/approval/getVerifCode`, formData, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}
