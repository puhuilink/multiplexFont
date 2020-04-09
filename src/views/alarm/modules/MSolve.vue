/*
 * 解决告警
 */
<template>
  <a-modal
    title="解决告警"
    :width="640"
    :visible="visible"
    @ok="handleSolve"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item
          label="处理意见"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea placeholder="请输入处理意见" :rows="4" v-decorator="['description']"/>
        </a-form-item>
        <a-form-item
          label="选项"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-checkbox-group
            :options="options"
            v-decorator="['checkbox', { initialValue: ['clearOut', 'recoverAll'] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
const update = gql`mutation update_t_alert ($idList: [numeric!] = [], $change: t_alert_set_input) {
  update_t_alert(
    where: {
      alert_id: {_in: $idList}
    },
    _set: $change
    ) {
    affected_rows
  }
}`

export default {
  name: 'MSolve',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      loading: false,
      options: [
        { label: '解决子告警', value: 'recoverAll' },
        { label: '设置为忽略', value: 'resolved' },
        { label: '清除内存', value: 'clearOut' }
      ],
      recoverAll: '',
      resolved: '',
      clearOut: '',
      idList: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    open (idList, record) {
      this.visible = true
      this.idList = idList
    },
    handleSolve (e) {
      const { form: { validateFields } } = this
      this.loading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          for (const i in values.checkbox) {
            console.log(values.checkbox[i])
            switch (values.checkbox[i]) {
              case 'recoverAll' :
                this.recoverAll = true
                break
              case 'resolved' :
                this.resolved = true
                break
              case 'clearOut' :
                this.clearOut = true
                break
              default :
                break
            }
          }
          this.update(values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    async update (values) {
      this.loading = true
      return apollo.clients.alert.mutate({
        mutation: update,
        variables: {
          idList: this.idList,
          change: {
            state: this.resolved ? 30 : 20,
            active_state: this.clearOut ? 2 : 0,
            comments: values.description
          }
        }
      }).then(res => {
        this.confirmLoading = false
        this.$notification.success({
          message: '系统提示',
          description: '告警解决'
        })
        this.$emit('ok')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
