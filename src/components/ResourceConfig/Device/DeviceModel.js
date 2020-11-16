import CListSelect from '~~~/ListSelect/CListSelect'
import { DictValueService } from '@/api'
import SelectMixin from '../SelectMixin'

const loadData = (value_parent_code) => DictValueService.find({
  where: {
    value_parent_code
  },
  fields: [
    'key: value_code',
    'label: value_label'
  ],
  alias: 'dataSource'
}).then(r => r.data.dataSource)

const props = {
  deviceBrand: {
    type: String,
    default: ''
  }
}

const ListSelect = {
  name: 'DeviceModelListSelect',
  props: {
    ...CListSelect.props,
    ...props
  },
  watch: {
    deviceBrand: {
      immediate: true,
      async handler (deviceBrand) {
        await this.$nextTick()
        this.$refs['listSelect'].reset()
        deviceBrand && this.$refs['listSelect'].refresh(deviceBrand)
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
        title: '品牌设备',
        data: this.loadData
      },
      on: this.$listeners,
      ref: 'listSelect'
    })
  }
}

const Select = {
  name: 'DeviceModelSelect',
  mixins: [SelectMixin],
  props: {
    ...props
  },
  watch: {
    deviceBrand: {
      immediate: true,
      async handler (deviceBrand) {
        await this.$nextTick()
        this.list = []
        deviceBrand && this.fetch(deviceBrand)
      }
    }
  },
  methods: {
    async fetch (value_parent_code) {
      try {
        this.loading = true
        this.list = await loadData(value_parent_code)
      } catch (e) {
        this.list = []
        console.log(e)
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}

const Factory = {
  Select,
  ListSelect
}

export default Factory
