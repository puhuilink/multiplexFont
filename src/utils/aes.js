const CryptoJS = require('crypto-js')
// 从环境读入而非硬编码到 JS 文件里
const key = CryptoJS.enc.Latin1.parse(process.env.VUE_APP_ENCRYPT_KEY)
const iv = CryptoJS.enc.Latin1.parse(process.env.VUE_APP_ENCRYPT_IV)

// 加密信息
export function encrypt (message) {
  return CryptoJS.AES.encrypt(message, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
  }).toString()
}

// 解密信息
export function decrypt (encryptMessage) {
  return CryptoJS.AES.decrypt(encryptMessage, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
  }).toString(CryptoJS.enc.Utf8)
}
