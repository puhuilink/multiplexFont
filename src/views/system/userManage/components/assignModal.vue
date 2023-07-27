<template>
  <a-modal
    v-model="visible"
    title="分配角色"
    ok-text="确认"
    cancel-text="取消"
    centered="true"
    @ok="onSubmit">
    <a-form-model
      v-bind="formLayout">
      <a-form-model-item
        label="登录名"
      >
        <a-input v-model="id" disabled></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="用户姓名"
      >
        <a-input v-model="name" disabled></a-input>
      </a-form-model-item>

      <a-form-model-item
        label="角色"
      >
        <a-input v-model="role" ></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'assignModal',
  props: {
    id: {
      type: String,
      default: () => '123'
    },
    name: {
      type: String,
      default: () => '123'
    },
    role: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 }
      }
    }
  },
  methods: {
    onSubmit () {
      this.visible = false
    },
    onShow () {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
