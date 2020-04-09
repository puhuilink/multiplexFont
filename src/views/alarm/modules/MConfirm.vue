/*
 * 确认告警
 */
<template>
  <a-modal
    title="确认告警"
    :visible="visible"
    @ok="handleConfim"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    destroyOnClose
  >
    <p>备注</p>
    <a-textarea placeholder="请输入备注" :rows="6" v-model="comments" :maxLength="500"/>
  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

export default {
  name: 'MConfirm',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      comments: ''
    }
  },
  methods: {
    open (record) {
      this.visible = true
      this.record = record
      console.log(record)
    },
    async handleConfim (e) {
      this.confirmLoading = true
      return apollo.clients.alert.mutate({
        mutation: gql`mutation update_t_alert($alert_id: [numeric!]=[], $changes: t_alert_set_input) {
          update_t_alert(where: {alert_id: {_in: $alert_id}}, _set: $changes) {
            affected_rows
            returning {
              state
            }
          }
        }`,
        variables: {
          alert_id: this.record,
          changes: {
            state: 5,
            comments: this.comments
          }
        }
      }).then(r => {
        this.confirmLoading = false
        this.$notification.success({
          message: '系统提示',
          description: '告警确认成功'
        })
        this.$emit('ok')
        this.handleCancel()
      })
    },
    handleCancel (e) {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
