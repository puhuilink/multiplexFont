/*
 * 巡检任务单 详情
 */
<template>
  <a-modal
    title="巡检检查对象详情"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <template>
      巡检检查对象
    </template>

    <template slot="footer" >
      <a-button @click="handleCancel">返回</a-button>
    </template>

  </a-modal>
</template>

<script>
export default {
  name: 'PODetail',
  data () {
    return {
      visible: false,
      loading: false,
      record: ''
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  methods: {
    async open (record) {
      this.visible = true
      this.record = record
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
