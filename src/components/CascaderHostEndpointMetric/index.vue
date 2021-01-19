<script>
import CascaderDictValue from '~~~/CascaderDictValue'
import { ModelService } from '@/api/index'

export default {
  name: 'CascaderHostEndpointMetric',
  mixins: [],
  components: {
    CascaderDictValue
  },
  props: {},
  data () {
    return {
      config: {
        dictValue: [],
        hostId: null,
        endpointModelId: null,
        endpointId: null,
        metricModelId: null,
        metricId: null
      },
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
  methods: {
    async fetchHostIds () {
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
    setDictValue (e) {
      this.config.dictValue = e
      this.setHostId(null)
      this.setEndpointModelId(null)
      if (this.hostTypeDictValueCode) {
        this.fetchHostIds()
        this.fetchEndpointModels()
      }
    },
    setHostId (hostId) {
      this.config.hostId = hostId
      this.setEndpointId(null)
    },
    setEndpointModelId (endpointModelId) {
      this.config.endpointModelId = endpointModelId
      this.setEndpointId(null)
      this.setMetricModelId(null)

      if (this.config.endpointModelId) {
        this.fetchMetricModels()
      }
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
    renderSelect ({ options, loading, value, onChange }) {
      return (
        <a-select
          allowClear
          class="CascaderHostEndpointMetric__select"
          notFoundContent={loading ? '加载中' : '暂无数据'}
          value={value}
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
            value: config.hostId,
            options: options.hosts,
            loading: loading.hosts,
            onChange: this.setHostId
          })
        }

        {
          this.renderSelect({
            value: config.endpointModelId,
            options: options.endpointModels,
            loading: loading.endpointModels,
            onChange: this.setEndpointModelId
          })
        }

        {
          this.renderSelect({
            value: config.metricModelId,
            options: options.metricModels,
            loading: loading.metricModels,
            onChange: this.setMetricModelId
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
    width: 150px !important;
  }
}
</style>
