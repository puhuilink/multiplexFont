export default {
  name: 'OperationNotification',
  methods: {
    noticiAddSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '新增成功'
      })
    },
    noticiEditSuccess () {
      this.$notification.success({
        message: '系统提示',
        description: '编辑成功'
      })
    },
    noticiError (e) {
      this.$notification.error({
        message: '系统提示',
        description: h => h('p', { domProps: { innerHTML: e } })
      })
    }
  }
}
