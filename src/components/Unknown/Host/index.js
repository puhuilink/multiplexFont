import CListSelect from '~~~/ListSelect/CListSelect'
import { CmdbService } from '@/api-hasura'
import SelectMixin from '../SelectMixin'

const loadData = (host_type) => CmdbService.hostFind({
  where: { host_type },
  fields: [
    'key: id',
    'label: alias'
  ],
  alias: 'dataSource'
}).then(r => r.data.dataSource)

const props = {
  hostType: {
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
  methods: {
    loadData
  },
  render (h) {
    return h(CListSelect, {
      props: {
        ...this.$props,
        // autoLoad: true,
        title: '监控类型',
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
    hostType: {
      immediate: true,
      handler (hostType) {
        this.list = []
        hostType && this.fetch(hostType)
      }
    }
  },
  methods: {
    async fetch (hostType) {
      try {
        this.loading = true
        this.list = await loadData(hostType)
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

const Factory = {
  create (type = 'listSelect') {
    return type === 'listSelect' ? ListSelect : Select
  }
}

export default Factory
