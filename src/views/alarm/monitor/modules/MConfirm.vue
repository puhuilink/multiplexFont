/*
 * 确认告警
 * Author: yizhu liu
 * Date: 2019-12-12 17:49:21
 * Email: lyz02413@163.com
 */
<template>
  <a-modal
    title="确认告警"
    :visible="visible"
    @ok="handleConfim"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <p>备注</p>
    <a-textarea placeholder="请输入备注" :rows="4" v-model="remark"/>
  </a-modal>
</template>

<script>
export default {
  name: 'MConfirm',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      remark: ''
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    handleConfim (e) {
      console.log(this.remarks)
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>>
