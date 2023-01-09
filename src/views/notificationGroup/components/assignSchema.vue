<template>
  <a-transfer
    :titles="['未分配', '已分配']"
    :data-source="mockData"
    :list-style="{
      width: '300px',
      height: '300px',
    }"
    :target-keys="targetKeys"
    :render="renderItem"
    :disabled="disabled"
    @change="handleChange"
    @search="handleSearch"
    show-search
    :filter-option="filterOption"
  />
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'

export default {
  name: 'AssignUser',
  mixins: [Schema],
  data () {
    return {
      mockData: [],
      targetKeys: [],
      disabled: false,
      loading: false
    }
  },
  methods: {
    assign () {
      this.visible = false
      // TODO 提交
      try {
        this.loading = true
        // await
        setInterval(() => {}, 1000)
        this.$notification.success({
          message: '系统提示',
          description: '分配组用户成功'
        })
        this.cancel()
      } finally {
        this.loading = false
      }
    },
    handleCancel () {
      this.visible = false
    },
    show (title) {
      this.visible = true
      this.title = title
      this.submit = this.assign
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
    renderItem (item) {
      const customLabel = (
        <span class='custom-item'>
          {item.title} - {item.description}
        </span>
      )

      return {
        label: customLabel, // for displayed item
        value: item.title // for title and filter matching
      }
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    filterOption (inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    handleSearch (dir, value) {
      console.log('search:', dir, value)
    }
  },
  mounted () {
    this.getMock()
  }
}
</script>

<style lang='less' scoped>

</style>
