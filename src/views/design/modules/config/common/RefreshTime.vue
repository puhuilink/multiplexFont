<template>
  <a-form-item label="刷新时间" v-bind="formItemLayout">
    <a-input
      :min="0"
      :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
      suffix="分钟"
      type="number"
      v-model.number="refreshTimeConfig.refreshTime"
      @input="change()"
    />
  </a-form-item>
</template>

<script>
import { mapState } from 'vuex'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_DH
} from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'RefreshTime',
  mixins: [],
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {
    ...mapState('screen', ['activeWidget']),
    refreshTimeConfig () {
      const { dbDataConfig = {}, sourceType } = this.activeWidget.config.dataConfig

      switch (sourceType) {
        case SOURCE_TYPE_ALARM:
          return dbDataConfig.alarmConfig || {}
        case SOURCE_TYPE_OVERVIEW:
          return dbDataConfig.overviewConfig || {}
        case SOURCE_TYPE_REAL:
          return dbDataConfig.resourceConfig || {}
        case SOURCE_TYPE_COMBO:
          return dbDataConfig.comboConfig || {}
        case SOURCE_TYPE_DH:
          return dbDataConfig.dhConfig || {}
        default:
          return {}
      }
    }
  },
  methods: {}
}
</script>

<style lang="less">

</style>
