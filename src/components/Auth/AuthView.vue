<template>
  <a-transfer
    :dataSource="mockData"
    showSearch
    :filterOption="filterOption"
    :targetKeys="targetKeys"
    @change="handleChange"
    @search="handleSearch"
    :render="item => item.title"
  >
  </a-transfer>
</template>

<script>
export default {
  name: 'AuthView',
  data () {
    return {
      // 所有数据
      mockData: [],
      // 选中数据
      targetKeys: []
    }
  },
  mounted () {
    this.getMock()
  },
  methods: {
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
      return option.description.indexOf(inputValue) > -1
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
