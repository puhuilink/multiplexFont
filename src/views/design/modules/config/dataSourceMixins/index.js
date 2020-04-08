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
    span: 16,
    offset: 2
  }
}

export default {
  data: () => ({
    formItemLayout,
    timeOptionList: [
      {
        name: '实时',
        value: ''
      },
      {
        name: '最近15分钟',
        value: ''
      },
      {
        name: '最近30分钟',
        value: ''
      },
      {
        name: '最近1小时',
        value: ''
      },
      {
        name: '最近2小时',
        value: ''
      },
      {
        name: '最近3小时',
        value: ''
      },
      {
        name: '最近1天',
        value: ''
      },
      {
        name: '最近1周',
        value: ''
      },
      {
        name: '最近2周',
        value: ''
      }
    ]
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    },
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
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    change (loadingDynamicData = false) {
      const activeWidget = _.cloneDeep(this.activeWidget)
      const { render } = this.activeWidget
      Object.assign(activeWidget.config, this.config)
      this.activateWidget({
        widget: Object.assign(activeWidget, { render })
      })
      this.$nextTick(() => {
        // 调整数据源过程中不需要反复刷新数据，只有显式要求刷新时再主动刷新
        loadingDynamicData && render.mergeOption(this.config, loadingDynamicData)
      })
    }
  }
}
