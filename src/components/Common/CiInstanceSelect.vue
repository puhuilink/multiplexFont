<template>
  <div class="CiInstanceSelect">
    <a-select
      showSearch
      :filterOption="filterOption"
      :labelInValue="labelInValue"
      :mode="multiple ? 'multiple' : 'default'"
      allowClear
      style="min-width: 200px"
      v-model="_value"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @change="handleChange"
    >
      <a-select-option
        v-for="(item, itemIdx) in options"
        :key="itemIdx"
        :value="item.value"
        v-if="item.value"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
// import { getInstanceList } from '@/api/controller/Resource'
import { InstanceService } from '@/api-hasura/index'

export default {
  name: 'CiInstanceSelect',
  components: {},
  props: {
    // eslint-disable-next-line
    value: {
      // type: Array,
      // default: () => ([])
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 父节点，不传时不进行查询（数据量太大）
    'parentName': {
      type: String,
      default: ''
    },
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    options: [],
    loading: false
  }),
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (v) {
        // 为维护字段一致性，对外统一暴露为数组格式
        // 当 multiple 为 true 时，v 为数组；反之为 string 或 undefined (当 allowClaear 触发时)
        const arr = v ? [v] : []
        this.$emit('input', this.multiple ? v : arr)
      }
    }
  },
  watch: {
    parentName: {
      immediate: true,
      handler (v) {
        if (v) {
          this.loadData({
            'parentName': {
              '_eq': this.parentName
            }
          })
        } else {
          this.options = []
        }
      }
    }
  },
  methods: {
    /**
     * 加载列表
     * TODO: 数据量较大，可分页加载，向下滑动时分页
     * TODO: 全选
     * @param where
     * @return {Promise<void>}
     */
    async loadData (where = {}) {
      try {
        this.loading = true
        const { data: { options } } = await InstanceService.find({
          where,
          fields: [
            '_id',
            'value: _id',
            'label',
            'name',
            'parentName'
          ],
          alias: 'options'
        })
        this.options = options
      } catch (e) {
        this.options = []
        throw e
      } finally {
        this.loading = false
      }
    },
    handleChange (value) {
      this._value = value
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="less">
</style>
