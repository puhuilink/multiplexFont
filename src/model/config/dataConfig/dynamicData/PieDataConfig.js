import { DynamicDataConfig } from './index'

export default class PieDataConfig extends DynamicDataConfig {
  async getOption () {
    try {
      const { data } = await this.fetch()
      console.log(data)
    } catch (e) {
      throw e
    } finally {

    }
  }
}
