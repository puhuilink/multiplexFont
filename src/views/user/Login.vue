<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="off"
          placeholder="账户名"
          v-decorator="[
            'userId',
            {rules: [
              { required: true, message: '请输入帐户名' },
              { min: 4, message: '用户名最少4位'},
              { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="off"
          placeholder="密码"
          v-decorator="[
            'pwd',
            {
              rules: [{ required: true, message: '请输入密码'}, { validator: handlePasswordLevel }], validateTrigger: ['change', 'blur']}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <!-- <a-form-item>
        <a-input size="large" type="text" autocomplete="off" placeholder="手机号" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
          <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item> -->

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input size="large" autocomplete="off" type="text" placeholder="验证码" v-decorator="['verifCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="getCaptcha"
            tabindex="-1"
            :loading="state.captchaLoading"
            :disabled="state.captchaDisabled"
            @click.stop.prevent="getCaptcha"
          >{{ captchaText }}</a-button>
        </a-col>
      </a-row>

      <!-- <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-pwd"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-item> -->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >登录</a-button>
      </a-form-item>

    </a-form>

    <two-step-verifCode
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-verifCode>
  </div>
</template>

<script>
// import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
// import { timeFix } from '@/utils/util'
import { sendCaptchaByUserId } from '@/api/login'
import _ from 'lodash'

export default {
  name: 'Login',
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 userId, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      hasSendVerifCode: false,
      verifCode: undefined,
      timer: null,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 userId, 2 telephone
        captchaLoading: false,
        loginType: 0,
        captchaDisabled: false
      }
    }
  },
  computed: {
    captchaText () {
      const { captchaLoading, captchaDisabled, time } = this.state
      if (captchaLoading) {
        return ''
      } else if (captchaDisabled) {
        return `${time}s`
      } else {
        return '获取验证码'
      }
    }
  },
  created () {
    // mock
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    handlePasswordLevel (rule, value, callback) {
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

      if (value.length < 8) {
        callback(new Error('密码至少8位'))
      } else {
        if (level >= 3) {
          this.state.percent = 100
          // if (level >= 3) {
          // }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          callback(new Error('英文字母区分大小写以及数字'))
        }
      }
    },
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true
      this.isLoginError = false

      const validateFieldsKey = customActiveKey === ['userId', 'pwd', 'mobile', 'verifCode']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          if (!this.hasSendVerifCode) {
            this.$message.error('请先获取验证码!')
            state.loginBtn = false
            return
          }
          Reflect.deleteProperty(loginParams, 'userId')
          loginParams[!state.loginType ? 'email' : 'userId'] = values.userId
          loginParams.pwd = values.pwd
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
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
    // 获取验证码
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['userId'], { force: true }, (err, values) => {
        if (!err) {
          state.captchaDisabled = true
          let interval
          this.state.captchaLoading = true
          this.hasSendVerifCode = false
          sendCaptchaByUserId(values['userId'])
            .then(() => {
              interval = window.setInterval(() => {
                if (state.time-- <= 0) {
                  state.time = 60
                  state.captchaDisabled = false
                  window.clearInterval(interval)
                }
              }, 1000)
              this.$message.success('短信已发送！')
              this.hasSendVerifCode = true
            })
            .catch(e => {
              this.$message.error('短信发送异常，请稍后尝试!')
              state.time = 60
              state.captchaDisabled = false
              window.clearInterval(interval)
              throw e
            })
            .finally(() => {
              this.state.captchaLoading = false
            })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      this.$router.push({ path: '/' })
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      const message = _.get(err, 'response.data.msg', err.message)
      console.log(message)
      // axios 拦截器已处理
      // this.$notification['error']({
      //   message: '登录失败',
      //   description: message || '请求出现错误，请稍后再试',
      //   duration: 4
      // })
      throw err
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  padding:30px 40px;
  background: rgba(0,0,0, 0.5);
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-pwd {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
