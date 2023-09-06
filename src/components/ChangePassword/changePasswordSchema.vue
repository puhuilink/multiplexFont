<template>
  <a-modal
    v-model="visible"
    title="修改密码"
    ok-text="确认"
    cancel-text="取消"
    :centered="true"
    destroyOnClose>
    <a-form-model
      ref="model"
      :model="record"
      v-bind="formLayout">
      <a-form-model-item
        prop="oldPassword"
        :rules="[
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          { validator: validateOldPassword, trigger: 'blur' }
        ]"
        label="原始密码"
      >
        <a-input type="password" v-model="record.oldPassword"></a-input>
      </a-form-model-item>
      <a-form-model-item
        prop="password"
        :rules="[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]"
        label="新密码"
      >
        <a-input type="password" v-model="record.password"></a-input>
      </a-form-model-item>
      <a-form-model-item
        prop="ackPassword"
        :rules="[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validateAckPassword, trigger: 'blur' }
        ]"
        label="确认密码"
      >
        <a-input type="password" v-model="record.ackPassword"></a-input>
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="onCancel">取消</a-button>
      <a-button @click="onSubmit" :loading="btnLoading" type="primary">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import { axios } from '@/utils/request'
import Vue from 'vue'
import { USER } from '@/store/mutation-types'

export default {
  name: 'DeleteSchema',
  data () {
    return {
      visible: false,
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 }
      },
      record: {},
      btnLoading: false,
      role: [],
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
      validateOldPassword: (rule, value, callback) => {
        if (value !== Vue.ls.get(USER).pwd) {
          callback(new Error('跟原密码不符！'))
        }
        callback()
      },
      validateAckPassword: (rule, value, callback) => {
        console.log('密码', this.record.password)
        if (value !== this.record.password) {
          callback(new Error('跟新密码不符！'))
        }
        callback()
      }
    }
  },
  methods: {
    onShow (record) {
      this.record = record
      this.visible = true
    },
    async onSubmit () {
      this.$refs.model.validate(async err => {
        if (!err) {

        } else {
          try {
            this.btnLoading = true
            await axios.post('/user/changeUserPwd', {
              id: this.record.id,
              newPwd: this.record.password
            })
            this.$notification.success({
              message: '系统提示',
              description: '修改密码成功'
            })
            this.$emit('operateSuccess')
          } catch (e) {
            // eslint-disable-next-line no-unused-expressions
            this.$notifyError
            throw e
          } finally {
            this.btnLoading = false
          }
          this.visible = false
        }
      })
    },
    onCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
