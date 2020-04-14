<template>
  <a-transfer
    :dataSource="viewList"
    showSearch
    :filterOption="filterOption"
    :targetKeys="_targetKeys"
    @change="handleChange"
    @search="handleSearch"
    :render="item => item.view_title"
  >
  </a-transfer>
</template>

<script>
import { getViewList } from '@/api/controller/View'
import { getViewListInGroupAuth } from '@/api/controller/ViewGroup'
// eslint-disable-next-line
import _ from 'lodash'

export default {
  name: 'AuthView',
  props: {
    // 用户组 id
    groupId: {
      type: String,
      default: ''
    },
    // 选中的 viewIds
    viewIds: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    viewList: [],
    // 所有数据
    mockData: [],
    // 选中数据
    targetKeys: [],
    groupViewList: []
  }),
  computed: {
    dataSourceKeys () {
      return this.viewList.map(el => el.key)
    },
    _targetKeys: {
      get () {
        // 求交集，去除历史冗余数据
        // TODO: 旧数据可能有用
        // return _.intersection(this.targetKeys, this.dataSourceKeys)
        return this.targetKeys
      },
      set (v) {
        this.targetKeys = v
        this.$emit('update:viewIds', [...v])
      }
    }
  },
  watch: {
    groupId: {
      immediate: true,
      handler (groupId) {
        groupId && this.fetchGroupViewList(groupId)
      }
    }
  },
  methods: {
    async fetchAllViewList () {
      try {
        this.loading = true
        // {key: string.isRequired,title: string.isRequired,description: string,disabled: bool}
        const viewList = await getViewList({ limit: 9999 }).then(r => r.data.data)
        this.viewList = viewList
          .filter(r => !!r.view_id)
          .map(el => {
            // console.log(el.view_id, el.view_title)
            return ({
              ...el,
              title: el['view_title'],
              key: el['view_id'].toString(),
              description: '',
              chosen: false
            })
          })
        // debugger
      } catch (e) {
        this.viewList = []
      } finally {
        this.loading = false
      }
    },
    /**
     * 用户组当前授予的视图
     */
    async fetchGroupViewList (groupId) {
      try {
        const groupViewList = (await getViewListInGroupAuth(groupId).then(r => r.data.data)).map(el => `${el.view_id}`)
        this._targetKeys = groupViewList
      } catch (e) {
        this._targetKeys = []
        throw e
      }
    },
    /**
     * 过滤条件
     * @param inputValue
     * @param option
     * @return {boolean}
     */
    filterOption (inputValue, option) {
      const title = option['view_title'] || ''
      return title.includes(
        inputValue.trim().toLowerCase()
      )
    },
    handleChange (targetKeys, direction, moveKeys) {
      // console.log(targetKeys, direction, moveKeys)
      this._targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    }
  },
  created () {
    this.fetchAllViewList()
  }
}
</script>
