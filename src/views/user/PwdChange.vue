<template>
  <div class="user-layout-register">
    <h3><span>密码重置</span></h3>
    <a-form ref="formRegister" :form="form" id="formRegister" class="PwdChange-form">
      <a-form-item v-bind="formItemLayout" label="原始密码">
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="原始密码"
          v-decorator="['encryptedPwd', {rules: [{ required: true, message: '请输入原始密码' }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>

      <a-popover
        placement="rightTop"
        :trigger="['focus']"
        :getPopupContainer="(trigger) => trigger.parentElement"
        v-model="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }" >
            <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            <div style="margin-top: 10px;">
              <span>8位以上，必须含数字/英文大写/英文小写三种组合</span>
            </div>
          </div>
        </template>

        <a-form-item v-bind="formItemLayout" label="新密码">
          <a-input
            size="large"
            type="password"
            @click="handlePasswordInputClick"
            autocomplete="false"
            placeholder="至少8位密码，区分大小写"
            v-decorator="['newEncryptedPwd', {rules: [{ required: true, message: '请输入新密码' }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
      </a-popover>

      <a-form-item v-bind="formItemLayout" label="确认密码">
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="确认密码"
          v-decorator="['password2', {rules: [{ required: true, message: '请确认密码' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <a-col class="gutter-row" :span="24" :offset="12">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="register-button"
            :loading="loading"
            @click.stop.prevent="handleSubmit"
            :disabled="loading">确定重置
          </a-button>
        </a-col>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { mapActions, mapGetters } from 'vuex'
import { UserService } from '@/api-hasura'

const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'PwdChange',
  components: {
  },
  mixins: [mixinDevice],
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 20 },
          sm: { span: 16 }
        }
      },
      state: {
        time: 60,
        smsSendBtn: false,
        captchaLoadin: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      captcha: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userId']),
    captchaText () {
      const { captchaLoading, captchaDisabled, time } = this.state
      if (captchaLoading) {
        return ''
      } else if (captchaDisabled) {
        return `${time}s`
      } else {
        return '获取验证码'
      }
    },
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handlePasswordLevel (rule, value = '', callback) {
      if (!value) {
        // 自动触发 required 规则，不进入 customer validator
        return callback()
      }
      if (value.length < 8) {
        return callback(new Error('至少8位密码，区分大小写'))
      }
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
      // if (/[^0-9a-zA-Z_]/.test(value)) {
      //   level++
      // }

      this.state.passwordLevel = level
      this.state.percent = level * 30

      if (level >= 3) {
        this.state.percent = 100
        // if (level >= 3) {
        // }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },

    handlePasswordCheck (rule, value = '', callback) {
      const password = this.form.getFieldValue('newEncryptedPwd') || ''
      // return console.log(password)
      if (!value) {
        // 自动触发 required 规则，不进入 customer validator
        return callback()
      }
      if (value && value.level < 8) {
        return callback(new Error('至少8位密码，区分大小写'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },

    handlePhoneCheck (rule, value, callback) {
      // TODO
      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handleSubmit () {
      const { form: { validateFields }, state, userId } = this
      validateFields({ force: true }, async (err, values) => {
        if (!err) {
          // console.log(values)
          // if (values.captcha === this.captcha) {
          //   Reflect.deleteProperty(values, 'captcha')
          // } else {
          //   this.$message.error('验证码错误!')
          //   this.loading = false
          //   return
          // }
          state.passwordLevelChecked = false
          this.loading = true
          try {
            await UserService.resetPwd({
              ...values,
              userId
            })
            this.requestSuccess()
          } catch (e) {
            throw e
          } finally {
            this.loading = false
          }
        }
      })
    },

    // 随机验证码
    randomCaptcha () {
      return new Array(6)
        .fill('')
        .map(() => (Math.random() * 9).toFixed())
        .join('')
    },

    requestSuccess () {
      let secondsToGo = 3
      const modal = this.$success({
        footer: null,
        closable: false,
        keyboard: false,
        title: '重置密码成功',
        content: `${secondsToGo}秒后将重定向到登录页面`
      })
      const interval = setInterval(() => {
        secondsToGo -= 1
        modal.update({
          content: `${secondsToGo}秒后将重定向到登录页面`
        })
      }, 1000)
      setTimeout(() => {
        clearInterval(interval)
        modal.destroy()
        this.Logout({}).then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 16)
        }).catch(err => {
          this.$message.error({
            title: '错误',
            description: err.message
          })
        })
      }, secondsToGo * 1000)
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loading = false
    }
  }
}
</script>
<style lang="less">
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }

  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
.PwdChange-form{
  padding: 30px 40px;
  width: 80%;
}
</style>
