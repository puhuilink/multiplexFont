<template>
  <a-modal
    :afterClose="reset"
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    :width="700"
    v-model="visible"
    wrapClassName="AlarmPopupDetail__modal"
    @cancel="onCancel"
    destroyOnClose
    @ok="submit">
    <a-form-model ref="ruleForm" :model="formModel">
      <a-row :gutter="[5, 8]" type="flex" align="middle">
        <a-col :span="12">
          <a-form-model-item
            label="用户名称"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="staffName"
            :rules="[{ required: true, message: '请填写用户名称' }]"
          >
            <a-input v-model="formModel.staffName"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="归属部门"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="orgId"
            :rules="[{ required: true, message: '请填写部门名称' }]"
          >
            <a-tree-select
              v-model="formModel.orgId"
              placeholder="选择上级部门"
              allow-clear
              tree-default-expand-all
              :treeData="treeData"
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="手机号码"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="mobilePhone"
            :rules="[{ required: true, message: '请填写手机号码' }]"
          >
            <a-input v-model="formModel.mobilePhone"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="邮箱"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="email"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          >
            <a-input v-model="formModel.email"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="登录名"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="userName"
            :rules="[
              { required: true, message: '请填写登录名' },
              { validator: validateUser, trigger: 'blur' }
            ]"
          >
            <a-input v-model="formModel.userName"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="登录密码"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="pwd"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePass, trigger: 'blur' }
            ]"
          >
            <a-input v-model="formModel.pwd"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="用户性别"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
          >
            <a-select
              v-model="formModel.gender"
            >
              <a-select-option value="man">男</a-select-option>
              <a-select-option value="woman">女</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="备注"
            v-bind="{
              labelCol: { span: 2, offset: 0 },
              wrapperCol: { span: 20, offset:1 },
            }"
          >
            <a-textarea
              v-model="formModel.remark"
              placeholder="备注"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <template #footer>
      <a-form-model-item
        v-bind="{
          labelCol: { span: 4 },
          wrapperCol: { span: 1, offset: 1 },
        }"
        label="启用"
        :style="{
          float: 'left',
          width: '300px',
        }"
        class="AlarmStrategy__modal-footer-left"
      >
        <a-select
          class="enabled"
          :style="{ width: '100px' }"
          :value="~~formModel.enabled"
          @select="formModel.enabled = !!$event"
        >
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="onSubmit" :loading="submitLoading" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { axios } from '@/utils/request'

export default {
  name: 'Schema',
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  mixins: [Schema],
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      formModel: {
        enabled: 1,
        apartmentId: ''
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16, offset: 1 }
      },
      validatePass: (rule, value, callback) => {
        let level = 0
        // 判断这个字符串中有没有数字
        if (/[0-9]/.test(value)) {
          level++
        }
        // 判断字符串中有没有大写字母
        if (/[A-Z]/.test(value)) {
          level++
        }

        // 判断字符串中有没有小写字母
        if (/[a-z]/.test(value)) {
          level++
        }
        // // 判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(value)) {
          level++
        }
        if (value.length < 8) {
          callback(new Error('密码至少8位'))
        } else {
          if (level >= 3) {
            callback()
          } else {
            callback(new Error('英文字母区分大小写以及数字'))
          }
        }
      },
      validateUser: (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('登录名至少3位'))
        }
      }
    }
  },
  methods: {
    add (text = null) {
      this.show('新建用户')
      this.isEdit = false
      this.formModel.apartmentId = text
    },
    onSubmit () {
      this.$refs.ruleForm.validate(validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        try {
          this.submitLoading = true
          axios.post('/user/save', {
            userName: this.formModel.userName,
            mobilePhone: this.formModel.mobilePhone,
            staffName: this.formModel.staffName,
            gender: this.formModel.gender,
            remark: this.formModel.remark,
            orgId: this.formModel.orgId,
            pwd: this.formModel.pwd,
            email: this.formModel.email,
            isOpen: this.formModel.enabled,
            ...this.isEdit ? { id: this.formModel.id } : {}
          })
          if (this.isEdit) {
            this.$notifyEditSuccess()
          } else {
            this.$notifyAddSuccess()
          }
          this.$emit('operateSuccess')
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    },
    edit (user) {
      console.log('user', user)
      this.show('编辑用户')
      this.isEdit = true
      this.formModel = {
        userName: user.userName,
        mobilePhone: user.mobilePhone,
        staffName: user.staffName,
        gender: user.gender,
        remark: user.remark,
        orgId: user.orgId,
        pwd: user.pwd,
        email: user.email,
        id: user.id,
        enabled: user.isOpen
      }
    },
    onCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
