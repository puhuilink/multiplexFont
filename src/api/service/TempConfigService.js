import { axios } from '@/utils/request'

// eslint-disable-next-line no-unused-vars
class TempConfigService {
  static async find (argus = {}) {
    await axios.post('/configuration/template/list', {})
  }
}
