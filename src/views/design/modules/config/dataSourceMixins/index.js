import _ from 'lodash'
import { mapState } from 'vuex'
import '@/assets/less/template.less'

export default {
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    },
    resourceConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.resourceConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.resourceConfig, v)
        this.change()
      }
    },
    available () {
      return Boolean(
        _.get(this.resourceConfig, 'selectedKpi.length') &&
        _.get(this.resourceConfig, 'selectedInstance.length')
      )
    }
  }
}
