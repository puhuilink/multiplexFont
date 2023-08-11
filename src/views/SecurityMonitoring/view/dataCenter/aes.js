const CryptoJS = require('crypto-js')

const VUE_APP_ENCRYPT_KEY = '2020040612063000'
const VUE_APP_ENCRYPT_IV = '1480349827802736'
const key = CryptoJS.enc.Latin1.parse(VUE_APP_ENCRYPT_KEY)
const iv = CryptoJS.enc.Latin1.parse(VUE_APP_ENCRYPT_IV)

export function encrypt (message) {
  return CryptoJS.AES.encrypt(message, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
  }).toString()
}

export function decrypt (encryptMessage) {
  if (encryptMessage) {
    return CryptoJS.AES.decrypt(encryptMessage, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC
    }).toString(CryptoJS.enc.Utf8)
  }
}
