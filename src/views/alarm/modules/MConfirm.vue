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
  >
    <p>备注</p>
    <a-textarea placeholder="请输入备注" :rows="6" v-model="comments"/>
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
    handleConfim (e) {
      console.log(this.data)
      this.confirmLoading = true
      // setTimeout(() => {
      //   this.visible = false
      //   this.confirmLoading = false
      // }, 2000)
      return apollo.clients.alert.query({
        query: gql`mutation update_t_alert($alert_id: numeric, $changes: t_alert_set_input) {
          update_t_alert(where: {alert_id: {_eq: $alert_id}}, _set: $changes) {
            affected_rows
            returning {
              state
            }
          }
        }`,
        variables: {
          alert_id: this.record[0].alert_id,
          changes: {
            state: '5',
            comments: this.comments
          }
        }
      }).then(r => {
        console.log(r)
        this.visible = false
        this.confirmLoading = false
      })
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
