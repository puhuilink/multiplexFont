import api from './index'
import { axios } from '@/utils/request'
import Timeout from 'await-timeout'
import { encrypt } from '@/utils/aes'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav (token) {
  return axios({
    url: '/user/nav',
    method: 'get'
  })
}

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
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}

/**
 * 发送验证码
 * @param data
 * @returns {AxiosPromise}
 */
export function sendCaptcha (data) {
  return axios({
    baseURL: '/api/approval/getVerifCode',
    method: 'post',
    data
  })
}

export const sendCaptchaByUserId = function (userId) {
  return axios.post(`/approval/getVerifCode?userId=${encrypt(userId)}`)
}
