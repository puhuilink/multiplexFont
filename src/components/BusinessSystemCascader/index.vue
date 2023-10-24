<script>
import { ModelService, CmdbHostEndpointMetricTreeService, CmdbHostTreeService } from '@/api/index'
import BusinessSystemTree from '~~~/BusinessSystemTree'
import { filterOption } from '@/utils/util'
export default {
  name: 'BusinessSystemCascader',
  components: { BusinessSystemTree },
  mixins: [],
  props: {
    config: {
      type: Object,
      default: () => ({
        systemId: null,
        hostIds: [],
        endpointModelId: null,
        endpointId: null,
        metricModelId: null,
        metricId: null
      })
    }
    // hostIds: {
    //   type: Array,
    //   default: () => [25614330288541700, 25614330288541704]
    // }
  },
  data () {
    return {
      options: {
        endpointModels: [],
        endpoints: [],
        metricModels: [],
        metrics: []
      },
      loading: {
        endpointModels: false,
        endpoints: false,
        metricModels: false,
        metrics: false
      }
    }
  },
  watch: {
    'config.systemId': {
      immediate: true,
      handler () {
        if (this.config.systemId) {
          this.fetchHostId()
        }
      }
    },
    'config.hostIds': {
      immediate: true,
      handler () {
        if (this.config.systemId && this.config.hostIds) {
          this.fetchEndpointModels(this.hostIds)
        }
      }
    },
    'config.endpointModelId': {
      immediate: true,
      handler () {
        if (this.config.endpointModelId) {
          this.fetchMetricModels()
          if (this.config.hostIds) {
            this.fetchEndpoints()
          }
        }
      }
    },
    'config.endpointId': {
      immediate: true,
      handler () {
        if (
          this.config.endpointModelId &&
          this.config.metricModelId
        ) {
          this.fetchMetricModels()
        }
      }
    },
    'config.metricModelId': {
      immediate: true,
      handler () {
        if (this.config.endpointModelId && this.config.metricModelId) {
          this.fetchMetrics()
        }
      }
    }
  },
  methods: {
    async fetchHostId () {
      try {
        this.config.hostIds = await CmdbHostTreeService.hostIdsQuery(this.config.systemId)
        // this.setEndpointModelId(null)
        // this.setEndpointId(null)
        // this.setMetricModelId(null)
        // this.setMetricId(null)
      } catch (e) {
        this.config.hostIds = []
      }
    },
    async fetchEndpointModels () {
      try {
        this.loading.endpointModels = true
        this.options.endpointModels = await CmdbHostEndpointMetricTreeService.endpointModel(this.config.hostIds)
      } catch (e) {
        this.options.endpointModels = []
        throw e
      } finally {
        this.loading.endpointModels = false
      }
    },
    async fetchEndpoints () {
      try {
        this.loading.endpoints = true
        this.options.endpoints = await CmdbHostEndpointMetricTreeService.endpintItem(this.config.hostIds, this.config.endpointModelId)
      } catch (e) {
        this.options.endpoints = []
        throw e
      } finally {
        this.loading.endpoints = false
      }
    },
    async fetchMetricModels () {
      try {
        this.loading.metricModels = true
        this.options.metricModels = await ModelService.metricModelsByEndpointModelId(this.config.endpointModelId)
      } catch (e) {
        this.options.metricModels = []
        throw e
      } finally {
        this.loading.metricModels = false
      }
    },
    async fetchMetrics () {
      try {
        // TODO 复制item和置空冲突
        // this.options.metrics = await CmdbService.metrics(
        //   this.config.hostId,
        //   this.config.endpointModelId,
        //   this.config.metricModelId
        // )
        this.loading.metrics = true
        this.options.metrics = await CmdbHostEndpointMetricTreeService.metricItem(
          this.config.hostIds,
          this.config.endpointModelId,
          this.config.metricModelId
        )
      } catch (e) {
        this.options.metrics = []
        throw e
      } finally {
        this.loading.metrics = false
      }
    },
    setEndpointModelId (endpointModelId) {
      this.config.endpointModelId = endpointModelId
      this.setEndpointId(null)
      this.setMetricModelId(null)
    },
    setEndpointId (endpointId) {
      this.config.endpointId = endpointId
      this.setMetricId(null)
    },
    setMetricModelId (metricModelId) {
      this.config.metricModelId = metricModelId
      this.setMetricId(null)
    },
    setMetricId (metricId) {
      this.config.metricId = metricId
    },
    renderSelect ({ options, placeholder = '', loading, value, onChange }) {
      // hack: ASelect传入null时不展示placeholder
      return (
        <a-select
          allowClear
          class="CascaderHostEndpointMetric__select"
          filterOption={filterOption}
          notFoundContent={loading ? '加载中' : '暂无数据'}
          placeholder={placeholder}
          showSearch
          value={value === null ? undefined : value}
          onChange={onChange}
        >
          {
            options.map(({ label, key }) => (
              <a-select-option
                key={key}
                value={key}
              >{label}</a-select-option>
            ))
          }
        </a-select>
      )
    }
  },
  render () {
    const { config, options, loading } = this
    return (
      <div>
        <BusinessSystemTree
          v-model={config.systemId}
        />
        {
          this.renderSelect({
            loading: loading.endpointModels,
            options: options.endpointModels,
            placeholder: '请选择检查实体（模型）',
            value: config.endpointModelId,
            onChange: this.setEndpointModelId
          })
        }

        {
          this.renderSelect({
            loading: loading.endpoints,
            options: options.endpoints,
            placeholder: '请选择检查实体（实例）',
            value: config.endpointId,
            onChange: this.setEndpointId
          })
        }

        {
          this.renderSelect({
            loading: loading.metricModels,
            options: options.metricModels,
            placeholder: '请选择指标（模型）',
            value: config.metricModelId,
            onChange: this.setMetricModelId
          })
        }

        {
          this.renderSelect({
            loading: loading.metricId,
            options: options.metrics,
            placeholder: '请选择指标（实例）',
            value: config.metricId,
            onChange: this.setMetricId
          })
        }

      </div>
    )
  }
}
</script>

<style lang="less">
  .CascaderHostEndpointMetric {

    &__select {
      width: 170px !important;
    }
  }
</style>
