<script>
import { Modal } from 'ant-design-vue'
import Timeout from 'await-timeout'

export default {
  name: 'Confirm',
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    $promiseConfirm ({
      title = '删除',
      content = '确定要删除选中的记录吗？',
      okText = '确定',
      okType = 'danger',
      cancelText = '取消',
      onOk = async () => {},
      maskClosable = true,
      keyboard = true
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
              // 维持至少 300 ms 动画时长
              await Timeout.set(300)
              resolve()
            }
          })
        },
        onCancel () {}
      })
    },
    $promiseConfirmDelete ({
      title = '删除',
      content = '确定要删除选中的记录吗？',
      okText = '确定',
      okType = 'danger',
      cancelText = '取消',
      onOk = async () => {},
      maskClosable = false,
      keyboard = false
    }) {
      this.$promiseConfirm({
        title,
        content,
        okText,
        okType,
        cancelText,
        maskClosable,
        keyboard,
        onOk
      })
    }
  }
}
</script>
