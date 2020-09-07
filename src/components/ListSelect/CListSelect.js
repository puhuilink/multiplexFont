/**
 * 传入函数自动加载数据的 ListSelect 封装
 */

import ListSelect from '~~~/ListSelect'
import _ from 'lodash'

export default {
  name: 'CListSelect',
  props: {
    ..._.omit(ListSelect.props, ['dataSource', 'loading']),
    autoLoad: {
      type: Boolean,
      default: false
    },
    data: {
      type: Function,
      default: () => Promise.resolve([])
    }
  },
  data: () => ({
    dataSource: [],
    loading: false
  }),
  methods: {
    async fetch (parameter) {
      try {
        this.loading = true
        this.dataSource = await this.data(parameter)
      } catch (e) {
        this.dataSource = []
        throw e
      } finally {
        this.loading = false
      }
    },
    refresh (parameter) {
      this.reset()
      this.fetch(parameter)
    },
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$emit('input', this.multiple ? [] : undefined)
    }
  },
  mounted () {
    this.autoLoad && this.fetch()
  },
  render (h) {
    return h(ListSelect, {
      props: {
        ...this.$props,
        ..._.pick(this, ['dataSource', 'loading'])
      },
      on: {
        ...this.$listeners
      }
    })
  }
}
