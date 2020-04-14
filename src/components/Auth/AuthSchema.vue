<template>
  <a-modal
    centered
    :confirmLoading="loading"
    destroyOnClose
    :title="title"
    :width="720"
    wrapClassName="AuthSchema__modal"
    v-model="visible"
    @cancel="cancel"
    @ok="save"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="视图管理" key="1">
        <AuthView :groupId="authView.groupId" />
      </a-tab-pane>
      <a-tab-pane tab="菜单模块" forceRender key="2">
        <AuthMenu :userId="userId" ref="menu" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import AuthView from './AuthView'
import AuthMenu from './AuthMenu'
import { modifyUserPermission } from '@/api/system'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

export default {
  name: 'AuthSchema',
  components: {
    AuthView,
    AuthMenu
  },
  props: {},
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    record: null,
    title: '',
    visible: false,
    authView: {
      groupId: ''
    },
    userId: ''
  }),
  methods: {
    edit (record) {
      this.title = '授权'
      this.visible = true
      this.userId = record.user_id
      this.authView.groupId = record['group_id']
    },
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async save () {
      try {
        this.loading = true
        const menu = this.$refs.menu.getCheckedMenu()
        const { code } = await modifyUserPermission(this.userId, menu)
        if (code === 200) {
          this.$notification.success({
            message: '保存成功'
          })
        }
      } catch (e) {
        this.$notification.error({
          message: '保存异常，请稍后再试'
        })
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less">
.AuthSchema__modal {
  .ant-modal-body {
    padding-top: 0;
    height: 508px;
  }
  .ant-transfer {
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .ant-transfer-operation {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ant-transfer-list {
    height: 400px;
    flex: 1;
  }
}
</style>
