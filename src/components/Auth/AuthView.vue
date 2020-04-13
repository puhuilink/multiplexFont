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

export default {
  name: 'AuthView',
  data () {
    return {
      viewList: [],
      // 所有数据
      mockData: [],
      // 选中数据
      targetKeys: []
    }
  },
  created () {
    // this.getMock()
    this.fetch()
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        // {key: string.isRequired,title: string.isRequired,description: string,disabled: bool}
        this.viewList = await getViewList({ limit: 9999 })
          .then(r => r.data.data)
          .then(r => r.filter(r => !!r.view_id && !!r.view_title))
      } catch (e) {
        this.viewList = []
      } finally {
        this.loading = false
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
