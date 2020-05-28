<script>
import { Modal } from 'ant-design-vue'

export default {
  name: 'Confirm',
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    $confirmDelete ({
      title = '删除',
      content = '确定要删除选中的记录吗？',
      okText = '确定',
      okType = 'danger',
      cancelText = '取消',
      onOk = async () => {},
      maskClosable = false,
      keyboard = false
    }) {
      Modal.confirm({
        title,
        content,
        okText,
        okType,
        cancelText,
        maskClosable,
        keyboard,
        onOk () {
          return new Promise(async resolve => {
            try {
              await onOk()
            } catch (e) {
              throw e
            } finally {
              resolve()
            }
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
