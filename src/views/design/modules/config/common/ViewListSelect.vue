<template>
  <div class="ViewListSelect">
    <a-form-item
      label="视图列表"
      v-bind="formItemLayout"
    >
      <a-select
        class="fw"
        :filterOption="filterOption"
        :maxTagCount="5"
        mode="multiple"
        :notFoundContent="loading ? '加载中' : '暂无数据'"
        showSearch
      >
        <a-select-option v-for="{ view_id, view_title } in viewList" :key="view_id">
          {{ view_title }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="钻取类型"
      v-bind="formItemLayout"
    >
      <a-select class="fw" :defaultValue="VIEW">
        <a-select-option v-for="{name, value} in options.click" :key="value">
          {{ name }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import ProprietaryMixins from '../proprietaryMixins'
import { ViewListService } from '@/api-hasura'
// import _ from 'lodash'
import { filterOption } from '@/utils/util'

const TAB = 'tab'
const VIEW = 'view'

export default {
  name: 'ViewListSelect',
  mixins: [DataSourceMixins, ProprietaryMixins],
  components: {},
  props: {},
  data: () => ({
    TAB,
    VIEW,
    loading: false,
    options: {
      click: [
        {
          name: '弹出视图',
          value: VIEW
        },
        {
          name: '切换到页签',
          value: TAB
        }
      ]
    },
    viewList: []
  }),
  computed: {
    // jumpViewList: {
    // get () {      },
    // set (jumpViewList) {}
    // }
  },
  methods: {
    filterOption,
    async loadData () {
      try {
        this.loading = true
        const { data: { viewList } } = await ViewListService.find({
          fields: [
            'view_id',
            'view_title'
          ],
          alias: 'viewList'
        })
        this.viewList = viewList
      } catch (e) {
        this.viewList = []
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="less">

</style>
