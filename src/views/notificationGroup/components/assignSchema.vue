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
    :filterOption="filter"
    :disabled="disabled"
    @change="handleChange"
    show-search
  >
  </a-transfer>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import _ from 'lodash'

export default {
  name: 'AssignUser',
  mixins: [Schema],
  props: {
    unassignedUser: {
      required: true,
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      mockData: [],
      targetKeys: [],
      disabled: false,
      loading: false,
      admin: ''
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
      const mockData = []
      this.mockData = this.unassignedUser
      for (const unassignedUserKey of this.unassignedUser) {
        const data = {
          key: unassignedUserKey.value,
          title: unassignedUserKey.label,
          disabled: false
        }
        mockData.push(data)
      }
      this.mockData = mockData
      this.dealValue()
    },
    setAdmin (value) {
      this.getMock()
      this.targetKeys.push(value)
      this.mockData[_.findIndex(this.mockData, el => el.key === value)].disabled = true
      this.admin = value
      this.dealValue()
    },
    setCommon (values = []) {
      this.getMock()
      this.mockData.push(...values)
      this.targetKeys.push(...values.map(el => el.key))
    },
    setSelected (value = []) {
      this.targetKeys.push(...value)
    },
    renderItem (item) {
      const customLabel = (
        <span class='custom-item'>
          {item.title}
        </span>
      )
      return {
        label: customLabel, // for displayed item
        value: item.key // for title and filter matching
      }
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
      this.dealValue()
    },
    filter (inputValue, options) {
      const value = _.get(options, 'title', '')
      return value.toLowerCase().indexOf(
        inputValue.trim().toLowerCase()
      ) > -1
    },
    dealValue () {
      this.$emit('updated', this.targetKeys.map(el => (el === this.admin ? { accountId: el, leader: true } : { accountId: el, leader: false })))
    }
  },
  mounted () {
    this.getMock()
  }
}
</script>

<style lang='less' scoped>

</style>
