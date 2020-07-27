export default {
  props: {
    field: {
      type: Object,
      required: true,
      default: () => ({})
    },
    formItemProps: {
      type: Object,
      default: () => ({
        labelCol: {
          span: 8
        },
        wrapperCol: {
          span: 12,
          offset: 4
        },
        style: {
          width: '100%'
        }
      })
    },
    formChildProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    label () {
      return this.field.label
    },
    dataType () {
      return this.field.dataType
    },
    displayType () {
      return this.field.displayType
    }
  }
}
