import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import '@/assets/less/template.less'
import { ScreenMutations } from '@/store/modules/screen'
import CacheMixin from '../cache'

export default {
  mixins: [CacheMixin],
  data: () => ({
    formItemLayout: {
      labelCol: {
        span: 6,
        offset: 0
      },
      wrapperCol: {
        span: 15,
        offset: 2
      }
    },
    btnLoading: false
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    // 外部 Ci 可用
    externalCi: {
      get () {
        return this.config.dataConfig.dbDataConfig.externalCi
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig, {
          externalCi: v
        })
        this.change()
      }
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
    alarmConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.alarmConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.alarmConfig, v)
        this.change()
      }
    },
    overviewConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.overviewConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.overviewConfig, v)
        this.change()
      }
    },
    available () {
      return Boolean(
        _.get(this.resourceConfig, 'selectedKpi.length') &&
        _.get(this.resourceConfig, 'selectedInstance.length')
      )
    },
    xAxisType: {
      get () {
        return _.get(this.config, 'dataConfig.dbDataConfig.xAxisType', 'RESOURCE')
      },
      set (xAxisType) {
        Object.assign(this.config.dataConfig.dbDataConfig, { xAxisType })
        this.change()
      }
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    async change (loadingDynamicData = false) {
      try {
        if (loadingDynamicData) {
          this.btnLoading = true
        }
        const { render, ...rest } = this.activeWidget
        const activeWidget = Object.assign({}, _.cloneDeep(rest), { render })
        // 设置当前选中部件
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
        await this.$nextTick()
        // 此处可能会改变数据，需要再次提交 vuex
        await render.mergeOption(this.config, loadingDynamicData)
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
      } catch (e) {
        throw e
      } finally {
        this.btnLoading = false
      }
    }
  }
}
