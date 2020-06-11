import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import '@/assets/less/template.less'
import { ScreenMutations } from '@/store/modules/screen'

const formItemLayout = {
  labelCol: {
    span: 6,
    offset: 0
  },
  wrapperCol: {
    span: 15,
    offset: 2
  }
}

export default {
  data: () => ({
    formItemLayout,
    options: {
      // TODO: 拆分为常量
      xAxisType: [
        {
          name: '资源',
          value: 'RESOURCE'
        },
        {
          name: '时间',
          value: 'TIME'
        }
      ]
    },
    btnLoading: false
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    },
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
    refreshTime: {
      get () {
        return this.config.dataConfig.dbDataConfig.refreshTime
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig, {
          refreshTime: v
        })
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
        const activeWidget = _.cloneDeep(this.activeWidget)
        const { render } = this.activeWidget
        // 设置当前选中不见
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
