import Vue from 'vue'
import { Modal } from 'ant-design-vue'

Vue.use(Modal)

export default {
  /**
   * 二次封装的modal
   * 返回： true/false
   */
  sureDelete () {
    return new Promise(resolve => {
      Modal.confirm({
        title: '删除',
        content: '确定要删除吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          setTimeout(resolve, 1000, true)
        },
        onCancel () {
          resolve(false)
        }
      })
    })
  }
}
