<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >

      <!-- 登录失败有 notification 提示 -->
      <!-- <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误" /> -->

      <!-- <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset', color: '#fff' }"
        @change="handleTabClick"
      >

        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账户名"
              v-decorator="[
                'userId',
                {rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="[
                'pwd',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-tab-pane>

        <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <a-input size="large" type="text" placeholder="手机号" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs> -->
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

      <!--      <a-form-item>-->
      <!--        <a-input size="large" type="text" autocomplete="off" placeholder="手机号" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">-->
      <!--          <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
      <!--        </a-input>-->
      <!--      </a-form-item>-->

      <!--      <a-row :gutter="16">-->
      <!--        <a-col class="gutter-row" :span="16">-->
      <!--          <a-form-item>-->
      <!--            <a-input size="large" autocomplete="off" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">-->
      <!--              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
      <!--            </a-input>-->
      <!--          </a-form-item>-->
      <!--        </a-col>-->
      <!--        <a-col class="gutter-row" :span="8">-->
      <!--          <a-button-->
      <!--            class="getCaptcha"-->
      <!--            tabindex="-1"-->
      <!--            :disabled="state.smsSendBtn"-->
      <!--            @click.stop.prevent="getCaptcha"-->
      <!--            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"-->
      <!--          ></a-button>-->
      <!--        </a-col>-->
      <!--      </a-row>-->

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

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
// import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import CryptoJS, { AES } from 'crypto-js'
import { sendCaptcha } from '@/api/login'

const key = CryptoJS.enc.Latin1.parse('6C2B0613CD90E9E8')

export default {
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
      captcha: undefined,
      timer: null,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 userId, 2 telephone
        loginType: 0,
        smsSendBtn: false
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

      // const validateFieldsKey = customActiveKey === 'tab1' ? ['userId', 'pwd'] : ['mobile', 'captcha']
      const validateFieldsKey = customActiveKey === ['userId', 'pwd', 'mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          // console.log('login form', values)
          // eslint-disable-next-line no-undef
          const loginParams = { ...values }
          // Todo 暂时注释验证码功能以方便开发
          // if (loginParams.captcha === this.captcha) {
          delete loginParams.userId
          loginParams[!state.loginType ? 'email' : 'userId'] = values.userId
          loginParams.pwd = values.pwd
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
          // } else {
          //   state.loginBtn = false
          //   if (this.captcha === null) {
          //     this.$message.warn('验证码已过期，请重新获取验证码！')
          //   } else {
          //     this.$message.error('验证码错误，请重新填写！')
          //   }
          // }
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

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          this.captcha = this.randomCaptcha()
          if (this.timer) clearTimeout(this.timer)

          // 开启三分钟定时器，清空验证码
          this.timer = setTimeout(() => { this.captcha = null }, 3 * 60000)

          const message = {
            mobile: values.mobile,
            content: `【中国交建】 验证码 ${this.captcha} 三分钟内有效，您正在登陆中国交建统一监控管理平台，请确认。`
          }

          const securityMessage = AES.encrypt(JSON.stringify(message), key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString()

          state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          sendCaptcha(securityMessage)
            .then(() => {
              this.$message.success('短信已发送！')
            })
            .catch(e => {
              this.$message.error('短信发送异常，请稍后尝试!')
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
              throw e
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
      this.$notification['error']({
        message: '错误',
        // description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        description: err.message,
        duration: 4
      })
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
