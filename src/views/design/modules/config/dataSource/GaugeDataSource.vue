<template>
  <div class="data-source common-template">
    <a-tooltip placement="top" title="加载假数据" arrowPointAtCenter>
      <a-button>模拟</a-button>
    </a-tooltip>
    <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
      <a-button :disabled="!available" @click="preview">预览</a-button>
    </a-tooltip>
    <a-collapse defaultActiveKey="1" :bordered="false">
      <!-- S 数据源 -->
      <a-collapse-panel header="数据源" key="1">
        <div class="comment-template__item">
          <!-- <p class="comment-template__leading">选择:</p>
          <div class="comment-template__inner">
            <a-select
              class="data-source__select"
              v-model="config.dataConfig.sourceType"
              @change="change">
              <a-select-option value="null">空数据</a-select-option>
              <a-select-option value="static">静态数据</a-select-option>
              <a-select-option value="real">实时数据</a-select-option>
            </a-select>
          </div> -->

          <a-form>
            <a-form-item
              label="Ci类型"
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              required
            >
              <CiModelSelect :value="formData.model" @input="onModelInput" />
            </a-form-item>
            <a-form-item
              label="Ci实例"
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              required
            >
              <CiInstanceSelect
                :parentNameS="formData.model"
                :value="formData.selectedInstance"
                @input="onInstanceInput"
              />
            </a-form-item>
            <a-form-item
              label="Kpi"
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              required
            >
              <KpiSelect
                v-model="formData.selectedKpi"
                :nodetypeS="formData.model"
                placeholder
              />
            </a-form-item>
          </a-form>
        </div>
        <!-- / 数据源选择 -->
      </a-collapse-panel>
      <!-- E 数据源 -->
    </a-collapse>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import {
  CiModelSelect,
  CiInstanceSelect,
  KpiSelect,
  BaselineStrategySelect
} from '@/components/Common'
import { getKpiList } from '@/api/controller/Kpi'
import { queryList } from './data'

const formItemLayout = {
  labelCol: {
    span: 6,
    offset: 0
  },
  wrapperCol: {
    span: 13,
    offset: 2
  }
}

const formData = {
  model: '',
  selectedInstance: [],
  selectedKpi: []
}

export default {
  name: 'GaugeDataSource',
  components: {
    CiModelSelect,
    CiInstanceSelect,
    KpiSelect,
    BaselineStrategySelect
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => _.cloneDeep(formData)
    }
  },
  data: (vm) => ({
    formItemLayout,
    form: vm.$form.create(vm),
    formData: null
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
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
  watch: {
    formData: {
      deep: true,
      handler (v) {
        // this.changeDynamicDataConfig()
        this.$emit('changeDynamicDataConfig', _.cloneDeep(this.formData))
      }
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
    onModelInput (v) {
      if (this.formData.model === v) {
        return
      }
      this.formData.selectedKpi = []
      this.formData.selectedInstance = []
      this.formData.model = v
    },
    onInstanceInput (arr = []) {
      this.formData.selectedInstance = Array.isArray(arr) ? arr : []
    },
    async preview () {
      try {
        const res = await getKpiList(queryList(this.formData))
        console.log(res)
      } catch (e) {
        throw e
      }
    }
  },
  created () {
    this.formData = _.isEmpty(this.value) ? _.cloneDeep(formData) : _.cloneDeep(this.value)
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
