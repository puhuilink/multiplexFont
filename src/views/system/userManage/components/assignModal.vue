<template>
  <a-modal
    v-model="visible"
    title="分配角色"
    ok-text="确认"
    cancel-text="取消"
    centered="true"
    destroyOnClose
    @ok="onSubmit">
    <a-form-model
      v-bind="formLayout">
      <a-form-model-item
        label="登录名"
      >
        <a-input v-model="record.userName" disabled></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="用户姓名"
      >
        <a-input v-model="record.staffName" disabled></a-input>
      </a-form-model-item>

      <a-form-model-item
        label="角色"
      >
        <a-select v-model="record.role">
          <a-select-option
            v-for="item in role"
            :key="item.id"
            :value="item.id"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button @click="onSubmit" :loading="btnLoading" type="primary">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import { axios } from '@/utils/request'

export default {
  name: 'AssignModal',
  props: {
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
      },
      record: {},
      btnLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        this.btnLoading = true
        // TODO 分配角色
        await axios.post('/role/addUsers', {
          userIds: [Number(this.record.id)],
          roleId: Number(this.record.role)
        })
        this.$notification.success({
          message: '系统提示',
          description: '分配角色完成'
        })
      } catch (e) {
        // eslint-disable-next-line no-unused-expressions
        this.$notifyError
        throw e
      } finally {
        this.btnLoading = false
      }
      this.visible = false
    },
    onShow (record) {
      this.record = record
      this.visible = true
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
