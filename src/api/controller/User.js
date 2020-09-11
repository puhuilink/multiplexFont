import { axios } from '@/utils/request'
import { encrypt } from '@/utils/aes'

export const login = function ({ userId, pwd, verifCode }) {
  return axios.post('/user/login', {
    userId: encrypt(userId),
    encryptedPwd: encrypt(pwd),
    ...process.env.VUE_APP_SMS_ENABLED === 'true' ? {
      verifCode: encrypt(verifCode)
    } : {}
  })
}

export const resetPwd = function ({ userId, encryptedPwd, newEncryptedPwd }) {
  const data = {
    userId: encrypt(userId),
    encryptedPwd: encrypt(encryptedPwd),
    newEncryptedPwd: encrypt(newEncryptedPwd)
  }
  return axios.post('/user/changePassword', data)
}

/**
 * 重置（初始化）用户密码为初始密码
 */
export const setInitialPwd = function (userId) {
  return axios.post(`/user/initPassword?userId=${encrypt(userId)}`)
}
