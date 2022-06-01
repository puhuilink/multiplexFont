export default {
  name: 'OperationNotification',
  methods: {
    $notifyAddSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '新增成功'
      })
    },
    $notifyEditSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '编辑成功'
      })
    },
    $notifyToggleFlagSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '更改状态成功'
      })
    },
    $notifyClearErrorSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '解除限制成功'
      })
    },
    $notifyDeleteSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '删除成功'
      })
    },
    $notifyError (e) {
      this.$notification.error({
        message: '系统提示',
        description: h => h('p', { domProps: { innerHTML: e } })
      })
    }
  }
}
