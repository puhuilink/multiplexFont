import { axios } from '@/utils/request'

class TempConfigService {
  static async find (argus = {}) {
    await axios.post('/configuration/template/list', {})
  }
}
