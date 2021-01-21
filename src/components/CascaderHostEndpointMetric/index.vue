<script>
import CascaderDictValue from '~~~/CascaderDictValue'
import { CmdbService, ModelService } from '@/api/index'
import { filterOption } from '@/utils/util'

export default {
  name: 'CascaderHostEndpointMetric',
  mixins: [],
  components: {
    CascaderDictValue
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        dictValue: [],
        hostId: null,
        endpointModelId: null,
        endpointId: null,
        metricModelId: null,
        metricId: null
      })
    }
  },
  data () {
    return {
      options: {
        hosts: [],
        endpointModels: [],
        endpoints: [],
        metricModels: [],
        metrics: []
      },
      loading: {
        hosts: false,
        endpointModels: false,
        endpoints: false,
        metricModels: false,
        metrics: false
      }
    }
  },
  computed: {
    hostTypeDictValueCode () {
      return this.config.dictValue[2]
    }
  },
  watch: {
    'config.dictValue': {
      immediate: true,
      handler () {
        if (this.hostTypeDictValueCode) {
          this.fetchHosts()
          this.fetchEndpointModels()
        }
      }
    },
    'config.hostId': {
      immediate: true,
      handler () {
        if (this.config.hostId && this.config.endpointModelId) {
          this.fetchEndpoints()
        }
      }
    },
    'config.endpointModelId': {
      immediate: true,
      handler () {
        if (this.config.endpointModelId) {
          this.fetchMetricModels()
          if (this.config.hostId) {
            this.fetchEndpoints()
          }
        }
      }
    },
    'config.endpointId': {
      immediate: true,
      handler () {
        if (
          this.config.hostId &&
          this.config.endpointModelId &&
          this.config.metricModelId
        ) {
          this.fetchMetrics()
        }
      }
    },
    'config.metricModelId': {
      immediate: true,
      handler () {
        if (this.config.hostId && this.config.endpointModelId && this.config.metricModelId) {
          this.fetchMetrics()
        }
      }
    }
  },
  methods: {
    async fetchHosts () {
      try {
        this.loading.hosts = true
        this.options.hosts = await ModelService.hostsByHostTypeDictValueCode(this.hostTypeDictValueCode)
      } catch (e) {
        this.options.hosts = []
        throw e
      } finally {
        this.loading.hosts = false
      }
    },
    async fetchEndpointModels () {
      try {
        this.loading.endpointModels = true
        this.options.endpointModels = await ModelService.endpointModelsByHostTypeDictValueCode(this.hostTypeDictValueCode)
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
        this.options.endpoints = await CmdbService.endpointsByHostIdAndEndpointModelId(this.config.hostId, this.config.endpointModelId)
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
        this.loading.metrics = true
        this.options.metrics = await CmdbService.metrics(
          this.config.hostId,
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
    setDictValue (dictValue) {
      this.config.dictValue = dictValue
      this.setHostId(null)
      this.setEndpointModelId(null)
    },
    setHostId (hostId) {
      this.config.hostId = hostId
      this.setEndpointId(null)
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
        <CascaderDictValue
          value={config.dictValue}
          onChange={this.setDictValue}
        />

        {
          this.renderSelect({
            loading: loading.hosts,
            options: options.hosts,
            placeholder: '请选择具体设备',
            value: config.hostId,
            onChange: this.setHostId
          })
        }

        {
          this.renderSelect({
            loading: loading.endpointModels,
            options: options.endpointModels,
            placeholder: '请选择监控实体（模型）',
            value: config.endpointModelId,
            onChange: this.setEndpointModelId
          })
        }

        {
          this.renderSelect({
            loading: loading.endpoints,
            options: options.endpoints,
            placeholder: '请选择监控实体（实例）',
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
