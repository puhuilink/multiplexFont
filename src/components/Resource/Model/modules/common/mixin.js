export default {
  props: {
    formItemProps: {
      type: Object,
      default: () => ({
        labelCol: {
          // span: 6
        },
        wrapperCol: {
          span: 23
        }
      })
    },
    formChildProps: {
      type: Object,
      default: () => ({})
    }
  }
}
