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
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="视图管理" key="1">
        <AuthView />
      </a-tab-pane>
      <a-tab-pane tab="菜单模块" forceRender key="2">
        <AuthMenu />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import AuthView from './AuthView'
import AuthMenu from './AuthMenu'

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
    visible: false
  }),
  computed: {},
  methods: {
    edit (record) {
      this.title = '授权'
      this.visible = true
    },
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
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
