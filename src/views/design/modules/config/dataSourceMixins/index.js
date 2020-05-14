import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import '@/assets/less/template.less'
import { ScreenMutations } from '@/store/modules/screen'
import { timeRangeSelectOptions } from '@/model/config/dataConfig/dynamicData'

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
    timeRangeSelectOptions: timeRangeSelectOptions.map(el => ({
      ...el,
      value: JSON.stringify(el.value)
    })),
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
    // 不是所有的视图组件都需要配置 timeRange
    timeRange: {
      get () {
        return _.get(this.config, 'dataConfig.dbDataConfig.timeRange')
      }
    },
    timeRangeStart: {
      get () {
        try {
          return JSON.stringify(this.timeRange.timeRangeStart)
        } catch (e) {
          return null
        }
      },
      set (v) {
        if (this.timeRange) {
          Object.assign(this.timeRange, {
            timeRangeStart: JSON.parse(v)
          })
          this.change()
        }
      }
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    async change (loadingDynamicData = false) {
      try {
        this.btnLoading = true
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
