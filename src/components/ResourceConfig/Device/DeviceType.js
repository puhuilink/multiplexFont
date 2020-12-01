import CListSelect from '~~~/ListSelect/CListSelect'
import { DictValueService } from '@/api'
import SelectMixin from '../SelectMixin'

const loadData = () => DictValueService.find({
  where: {
    value_param: '1'
  },
  fields: [
    'key: value_code',
    'label: value_label'
  ],
  alias: 'dataSource'
}).then(r => r.data.dataSource)

const ListSelect = {
  name: 'DeviceTypeListSelect',
  props: {
    ...CListSelect.props
  },
  methods: {
    loadData
  },
  render (h) {
    return h(CListSelect, {
      props: {
        ...this.$props,
        autoLoad: true,
        title: '监控类型',
        data: this.loadData
      },
      on: this.$listeners,
      ref: 'listSelect'
    })
  }
}

const Select = {
  name: 'DeviceTypeSelect',
  mixins: [SelectMixin],
  methods: {
    async fetch () {
      try {
        this.loading = true
        this.list = await loadData()
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.fetch()
  }
}

export {
  Select,
  ListSelect
}
