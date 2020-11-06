<template>
  <a-spin :spinning="loading">
    <a-transfer
      :dataSource="viewList"
      showSearch
      :filterOption="filterOption"
      :targetKeys="_targetKeys"
      @change="handleChange"
      :render="item => item.view_title"
    >
    </a-transfer>
  </a-spin>
</template>

<script>
import _ from 'lodash'
import { AuthorizeObjectService, ViewListService } from '@/api'

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
    },
    record: {
      type: Object,
      default: () => ({})
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
        return _.intersection(this.targetKeys, this.dataSourceKeys)
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
    },
    record: {
      immediate: true,
      deep: true,
      handler (record) {
        const groupId = _.get(record, 'group_id')
        const userId = _.get(record, 'user_id')
        if (groupId) {
          this.fetchGroupViewList(groupId)
        } else if (userId) {
          this.fetchUserViewList(userId)
        }
      }
    }
  },
  methods: {
    async fetchAllViewList () {
      try {
        this.loading = true
        const { data: { viewList } } = await ViewListService.find({ alias: 'viewList' })
        this.viewList = viewList
          .filter(el => {
            if (el.view_id) {
              Object.assign(el, {
                title: el['view_title'],
                key: el['view_id'].toString(),
                description: '',
                chosen: false
              })
            }
            return el
          })
      } catch (e) {
        this.viewList = []
        throw e
      } finally {
        this.loading = false
      }
    },
    /**
     * 用户组当前授予的视图
     */
    async fetchGroupViewList (group_id) {
      try {
        this._targetKeys = await AuthorizeObjectService.viewIdList({ group_id })
      } catch (e) {
        this._targetKeys = []
        throw e
      }
    },
    /**
     * 用户当前授予的视图
     */
    async fetchUserViewList (user_id) {
      try {
        this._targetKeys = await AuthorizeObjectService.viewIdList({ user_id })
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
      this._targetKeys = targetKeys
    }
  },
  created () {
    this.fetchAllViewList()
  }
}
</script>
