import { axios } from '@/utils/request'
import { encrypt, decrypt } from '@/utils/aes'
import { notifyGraphQLError } from '@/utils/clientConfig'

class BaseService {
  /**
   * 加密hasura接口参数通过后端接口转发至hasura
   * @param {*} requestBody
   * @return {Promise<{ data, code }>}
   */
  static async hasuraTransfer (requestBody = {}) {
    const requestBodyStr = JSON.stringify(requestBody)
    const formData = new FormData()
    formData.append('body', encrypt(requestBodyStr))

    // debug info
    if (process.env.NODE_ENV === 'development') {
      formData.append('originalRequestBody', requestBodyStr)
    }

    const response = await axios.post('/Hasura/transfer', formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })

    const data = JSON.parse(decrypt(response.data))
    if (data.errors) {
      notifyGraphQLError(data.errors)
      return Promise.reject(data.errors)
    }
    return Promise.resolve(data)
  }
}

export {
  BaseService
}
