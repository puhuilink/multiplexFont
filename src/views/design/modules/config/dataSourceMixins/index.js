import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import '@/assets/less/template.less'
import { ScreenMutations } from '@/store/modules/screen'
import CacheMixin from '../cache'
import * as formItems from '../formItems/index'

export default {
  name: 'DataSourceMixins',
  mixins: [CacheMixin],
  components: {
    ...formItems
  },
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
    dbDataConfig () {
      return this.config.dataConfig.dbDataConfig
    },
    sourceType () {
      return this.config.dataConfig.sourceType
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
    numberConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.numberConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.numberConfig, v)
        this.change()
      }
    },
    sqlConfig: {
      get () {
        console.log(this.config.dataConfig.dbDataConfig.sqlConfig)
        return this.config.dataConfig.dbDataConfig.sqlConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.sqlConfig, v)
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
        console.log(loadingDynamicData)
        if (loadingDynamicData) {
          this.btnLoading = true
        }
        const { render, ...rest } = this.activeWidget
        console.log('render', render)
        const activeWidget = Object.assign({}, _.cloneDeep(rest), { render })
        // 设置当前选中部件
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
        await this.$nextTick()
        // 此处可能会改变数据，需要再次提交 vuex
        console.log('config', this.config)
        await render.mergeOption(this.config, loadingDynamicData)
        console.log(123)
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
      } catch (e) {
        throw e
      } finally {
        this.btnLoading = false
      }
    },
    async preview () {
      await this.change(true)
    }
  }
}
