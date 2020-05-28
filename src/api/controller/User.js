import { axios } from '@/utils/request'
import { encrypt } from '@/utils/aes'

export const login = function ({ userId, pwd }) {
  const encryptedPwd = encrypt(pwd)
  const user = encrypt(userId)

  return axios.post('/user/login', {
    userId: user,
    encryptedPwd
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
