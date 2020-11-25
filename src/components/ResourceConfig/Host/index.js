import CListSelect from '~~~/ListSelect/CListSelect'
import { ModelService } from '@/api'
import SelectMixin from '../SelectMixin'

const loadData = (host_type_dict_value_code) => ModelService.hostFind({
  where: { host_type_dict_value_code },
  fields: [
    `children {
      label: alias
      key: id
    }`
  ],
  alias: 'dataSource'
}).then(r => r.data.dataSource[0] || {})
  .then(({ children = [] }) => children)

const props = {
  hostTypeDictValueCode: {
    type: String,
    default: ''
  }
}

const ListSelect = {
  name: 'HostListSelect',
  props: {
    ...CListSelect.props,
    ...props
  },
  watch: {
    hostTypeDictValueCode: {
      immediate: true,
      async handler (hostTypeDictValueCode) {
        await this.$nextTick()
        this.$refs['listSelect'].reset()
        hostTypeDictValueCode && this.$refs['listSelect'].refresh(hostTypeDictValueCode)
      }
    }

  },
  methods: {
    loadData
  },
  render (h) {
    return h(CListSelect, {
      props: {
        ...this.$props,
        title: '设备名称',
        data: this.loadData
      },
      on: this.$listeners,
      ref: 'listSelect'
    })
  }
}

const Select = {
  name: 'HostSelect',
  mixins: [SelectMixin],
  props: {
    ...props
  },
  watch: {
    hostTypeDictValueCode: {
      immediate: true,
      async handler (hostTypeDictValueCode) {
        await this.$nextTick()
        this.list = []
        hostTypeDictValueCode && this.fetch(hostTypeDictValueCode)
      }
    }
  },
  methods: {
    async fetch (hostTypeDictValueCode) {
      try {
        this.loading = true
        this.list = await loadData(hostTypeDictValueCode)
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}

export {
  Select,
  ListSelect
}
