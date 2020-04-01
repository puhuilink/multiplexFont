<template>
  <DataSourceTemplate>
    <template #real>
      <!-- <a-tooltip placement="top" title="加载假数据" arrowPointAtCenter>
        <a-button>模拟</a-button>
      </a-tooltip> -->
      <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
        <a-button :disabled="!available" @click="preview">预览</a-button>
      </a-tooltip>

      <ComboSelect :multiple="true" v-model="formData" />

    </template>
  </DataSourceTemplate>
</template>

<script>
/* eslint-disable */
import '@/assets/less/template.less'
import _ from 'lodash'
import { ComboSelect } from '@/components/Common'
import { mapState, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import { getKpiList } from '@/api/controller/Kpi'
import { queryList } from './data'
import { getComponentValues } from '@/api/controller/View'
import DataSourceTemplate from './index'
import ProprietaryMixins from '../propietaryMixins'

export default {
  name: 'BarDataSource',
  mixins: [ProprietaryMixins],
  components: {
    DataSourceTemplate,
    ComboSelect
  },
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    },
    formData: {
      get () {
        return this.config.dataConfig.dbDataConfig
      },
      set (v) {
        this.config.dataConfig.dbDataConfig = v
        this.change()
      }
    },
    available () {
      return Boolean(
        this.formData &&
        this.formData.selectedKpi &&
        this.formData.selectedKpi.length &&
        this.formData.selectedInstance &&
        this.formData.selectedInstance.length
      )
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    change () {
      const activeWidget = _.cloneDeep(this.activeWidget)
      const { render } = this.activeWidget
      Object.assign(activeWidget.config, this.config)
      this.activateWidget({
        widget: Object.assign(activeWidget, { render })
      })
      render.mergeOption(this.config)
    },
    async preview () {
      getComponentValues(this.formData)
      // // TODO: data直接初始化为对象而非数组
      // const set = v => this.$set(this.config.proprietaryConfig.series.data[0], 'value', v)
      // try {
      //   const { data } = await getKpiList(queryList(this.formData))
      //   if (data.length) {
      //     set(data[0].value)
      //   } else {
      //     set(0)
      //   }
      // } catch (e) {
      //   set(0)
      //   throw e
      // } finally {
      //   this.change()
      // }
    }
  }
}
</script>

<style scoped lang="less">
.data-source {
  &__select {
    width: 100%;
  }
}
</style>
