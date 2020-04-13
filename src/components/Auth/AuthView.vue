<template>
  <a-transfer
    :dataSource="viewList"
    showSearch
    :filterOption="filterOption"
    :targetKeys="targetKeys"
    @change="handleChange"
    @search="handleSearch"
    :render="item => item.view_title"
    :rowKey="item => item.view_id"
  >
  </a-transfer>
</template>

<script>
import { getViewList } from '@/api/controller/View'
import { getViewListInGroupAuth } from '@/api/controller/ViewGroup'

export default {
  name: 'AuthView',
  props: {
    // 用户组 id
    groupId: {
      type: String,
      default: ''
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
  watch: {
    groupId: {
      immediate: true,
      handler (groupId) {
        groupId && this.fetchGroupViewList(groupId)
      }
    }
  },
  created () {
    // this.getMock()
    this.fetchAllViewList()
  },
  methods: {
    async fetchAllViewList () {
      try {
        this.loading = true
        // {key: string.isRequired,title: string.isRequired,description: string,disabled: bool}
        const viewList = await getViewList({ limit: 9999 }).then(r => r.data.data)
        this.viewList = viewList
          .filter(r => !!r.view_id)
          .map(el => ({
            ...el,
            title: el['view_title'],
            key: el['view_id'].toString(),
            description: '',
            chosen: false
          }))
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
    async fetchGroupViewList (groupIds) {
      try {
        const groupViewList = await getViewListInGroupAuth(groupIds).then(r => r.data.data)
        console.log(groupViewList)
        this.targetKeys = groupViewList.map(el => Number(el.view_id))
      } catch (e) {
        this.targetKeys = []
        throw e
      }
    },
    getMock () {
      const targetKeys = []
      const mockData = []
      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1
        }
        if (data.chosen) {
          targetKeys.push(data.key)
        }
        mockData.push(data)
      }
      this.mockData = mockData
      this.targetKeys = targetKeys
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
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    }
  }
}
</script>
