<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :footer="null"
    :title="title"
    v-model="visible"
    :width="940"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="操作帐号"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'username',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="客户端IP"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'username',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="模块名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'username',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="功能名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'username',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="操作时间"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'username',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="操作内容"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-textarea
              readOnly
              disabled
              v-decorator="[
                'username',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

export default {
  name: 'AduitSchema',
  components: {},
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
    show (record) {
      this.title = '查看'
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

</style>
