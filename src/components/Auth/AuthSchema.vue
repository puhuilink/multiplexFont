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
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="视图管理" key="1">
        <AuthView :record="authView.record" :viewIds.sync="authView.viewIds" />
      </a-tab-pane>
      <a-tab-pane tab="菜单模块" forceRender key="2">
        <AuthMenu :record="authView.record" ref="menu" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
/* eslint-disable camelcase */
import AuthView from './AuthView'
import AuthMenu from './AuthMenu'
import { modifyUserPermission, modifyGroupPermission } from '@/api/system'
import { allocateGroupViewAuth, allocateUserViewAuth } from '@/api/controller/AuthorizeObject'

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
      // 选中的 viewId
      viewIds: [],
      record: null
    },
    userId: ''
  }),
  methods: {
    edit (record) {
      this.title = '授权'
      this.visible = true
      this.userId = record.user_id
      this.record = { ...record }
      this.authView.record = { ...record }
      console.log(record)
    },
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async submit () {
      try {
        this.loading = true
        const menu = this.$refs.menu.getCheckedMenu()
        const { authView: { viewIds }, record: { user_id, group_id } } = this
        if (user_id) {
          await allocateUserViewAuth(user_id, viewIds)
          await modifyUserPermission(user_id, menu)
        } else if (group_id) {
          await allocateGroupViewAuth(group_id, viewIds)
          await modifyGroupPermission(group_id, menu)
        }
        this.visible = false
        this.$notification.success({
          message: '系统提示',
          description: '分配权限成功'
        })
        this.$emit('success')
      } catch (e) {
        this.$notification.error({
          message: '保存异常，请稍后再试!'
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
