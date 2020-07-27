import Vue from 'vue'
import { Modal } from 'ant-design-vue'

Vue.use(Modal)

export default {
  /**
   * 二次封装的启用modal
   * 返回： true/false
   */
  enable () {
    return new Promise(resolve => {
      Modal.confirm({
        title: '启用',
        content: '确定要启用吗？',
        okText: '确定',
        okType: 'text',
        cancelText: '取消',
        onOk () {
          setTimeout(resolve, 1000, true)
        },
        onCancel () {
          resolve(false)
        }
      })
    })
  },
  /**
   * 二次封装的停用modal
   * 返回： true/false
   */
  disable () {
    return new Promise(resolve => {
      Modal.confirm({
        title: '停用',
        content: '确定要停用吗？',
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
