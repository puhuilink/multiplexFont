<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >

      <!-- / 账户名 -->
      <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="off"
          placeholder="账户名"
          v-decorator="[
            'userId',
            {
              rules: [
                { required: true, message: '请输入帐户名' },
                { min: 3, message: '用户名最少3位'},
                { validator: handleUsernameOrEmail }
              ],
              validateTrigger: 'change'
            }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <!-- / 密码 -->
      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="off"
          placeholder="密码"
          v-decorator="[
            'pwd',
            {
              rules: [
                { required: true, message: '请输入密码'},
                { validator: handlePasswordLevel }
              ],
              validateTrigger: ['change', 'blur']
            }
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <!-- / 手机号 -->
      <!-- <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="off"
          placeholder="手机号"
          v-decorator="[
            'mobile', {
              rules: [
                { required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }
              ],
              validateTrigger: 'change'
            }
          ]">
          <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item> -->

      <!-- / 验证码 -->
      <a-row :gutter="16" v-if="VUE_APP_SMS_ENABLED">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input
              size="large"
              autocomplete="off"
              placeholder="验证码"
              v-decorator="[
                'verifCode',
                {
                  rules: [{ required: true, message: '请输入验证码' }],
                  validateTrigger: 'blur'
                }
              ]">
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

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="14">
          <a-form-item>
            <a-input
              size="large"
              autocomplete="off"
              placeholder="验证码"
              v-decorator="[
                'verifCode',
                {
                  rules: [{ validator: handleCode}],
                  validateTrigger: 'change'
                }
              ]"/>
            <div @click="refreshCode">
              <identify :identify-code="identifyCode" :contentWidth="120" :contentHeight="38" class="verify"></identify>
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- / 提交 -->
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
    <!--    @otpSuccess="finalLogin"-->
    <secondFactoryOTP ref="factory" @close="onClose" @loginSuccess="loginSuccess"></secondFactoryOTP>
    <RegOTP ref="reg" @close="onClose" @otpSuccess="loginSuccess"></RegOTP>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { UserService } from '@/api'
import identify from '@/components/identify/index'
import axios from 'axios'
import secondFactoryOTP from '@/components/otp/SecondFactorOTP'
import RegOTP from '@/components/otp/RegOTP'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import store from '@/store'

const VUE_APP_SMS_ENABLED = process.env.VUE_APP_SMS_ENABLED === 'true'

export default {
  name: 'Login',
  components: { identify, secondFactoryOTP, RegOTP },
  data () {
    return {
      VUE_APP_SMS_ENABLED,
      loginBtn: false,
      // login type: 0 email, 1 userId, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      hasSentVerifCode: false,
      verifCode: undefined,
      timer: null,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 userId, 2 telephone
        captchaLoading: false,
        loginType: 0,
        captchaDisabled: false
      },
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      identifyCode: '',
      loginParams: {},
      otpName: process.env.VUE_APP_OTP_QUOTE_NAME,
      loginData: null
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
    handleCode (rule, value, callback) {
      if (value === this.identifyCode) {
        callback()
      } else callback(new Error('验证码不对'))
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      const validateFieldsKey = customActiveKey === ['userId', 'pwd', 'mobile', 'verifCode']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (err) {
          return
        }
        // console.log(values)
        // console.log(this.loginParams)
        // 填写过内容后,登录
        this.Login(values)
          .then((res) => {
            // 登录通过
            // console.log(res)
            this.loginData = res
            // otp验证是否开启-------
            if (VUE_APP_SMS_ENABLED && !this.hasSentVerifCode) {
              this.$message.error('请先获取验证码!')
              state.loginBtn = false
              return
            }
            Vue.ls.remove(ACCESS_TOKEN)
            state.loginBtn = true
            this.isLoginError = false

            const loginParams = { ...values }

            Reflect.deleteProperty(loginParams, 'userId')
            loginParams[!state.loginType ? 'email' : 'userId'] = values.userId
            loginParams.pwd = values.pwd
            this.loginParams = loginParams
            if (JSON.parse(process.env.VUE_APP_OTP_SWITCH)) {
              axios.post('/otp/getStatus', {
                appId: this.otpName,
                userName: values.userId,
                transNo: 'transNo1'
              }, {
                baseURL: process.env.VUE_APP_OTP_BASE_URL
              }).then((res) => {
                if (res.data.statusCode === 1201) {
                  this.$refs.reg.otpBind({
                    appId: this.otpName,
                    userName: values.userId,
                    transNo: 'transNo1'
                  })
                } else if (res.data.statusCode === 1200) {
                  this.$refs.factory.onShow({
                    appId: this.otpName,
                    userName: values.userId,
                    transNo: 'transNo1'
                  })
                  axios.post('/otp/msgOtp', {
                    appId: this.otpName,
                    userName: values.userId,
                    transNo: 'transNo1'
                  }, {
                    baseURL: process.env.VUE_APP_OTP_BASE_URL
                  })
                }
              })
            } else {
              this.loginSuccess(res)

              /* Login(loginParams)
                .then((res) => this.loginSuccess(res))
                .catch(err => this.requestFailed(err))
                .finally(() => {
                  state.loginBtn = false
                }) */
            }
          })
          .catch(err => {
            // 登录错误
            // console.log(err)
            this.requestFailed(err)
          }
          ).finally(() => {
            state.loginBtn = false
          })
      })
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
          this.hasSentVerifCode = false
          UserService.sendCaptchaByUserId(values['userId'])
            .then(({ msg = '验证码已通过短信发送到账户手机，请注意查收！' }) => {
              interval = window.setInterval(() => {
                if (state.time-- <= 0) {
                  state.time = 60
                  state.captchaDisabled = false
                  window.clearInterval(interval)
                }
              }, 1000)
              this.$message.success(msg)
              this.hasSentVerifCode = true
            })
            .catch(e => {
              this.$message.error('验证码发送异常，请稍后尝试!')
              state.time = 60
              state.captchaDisabled = false
              window.clearInterval(interval)
              this.hasSentVerifCode = false
              throw e
            })
            .finally(() => {
              this.state.captchaLoading = false
            })
        }
      })
    },
    // stepCaptchaSuccess () {
    //   this.loginSuccess()
    // },
    // stepCaptchaCancel () {
    //   this.Logout().then(() => {
    //     this.loginBtn = false
    //     this.stepCaptchaVisible = false
    //   })
    // },
    // finalLogin () {
    //   console.log(123)
    //   this.Login(this.loginParams)
    //     .then((res) => {
    //       console.log(res)
    //       this.loginSuccess(res)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //
    //         this.requestFailed(err)
    //       }
    //     )
    //   // .finally(() => {
    //   //   this.state.loginBtn = false
    //   // })
    // },
    onClose () {
      this.state.loginBtn = false
    },
    loginSuccess () {
      // zhe
      Vue.ls.set('Authorization', store.getters.token, 7 * 24 * 60 * 60 * 1000)

      const res = this.loginData
      if (res.menuCodes) {
        this.$router.push({ path: '/' })
        location.reload()
      } else {
        this.$router.push({ path: '/user/login' })
        // location.reload()
        this.$notification.error({
          message: '账号无效',
          description: '请联系系统管理员'
        })
      }
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      throw err
    },
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }
  },
  mounted () {
    this.refreshCode()
  }
}
</script>

<style lang="less" scoped>
.main{
  padding:30px 40px;
  background: rgba(0,0,0, 0.5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
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

  .code{
    width: 500px;
    height: 31.25rem;
    border: 1px solid #ddd;
  }
}

.verify {
  width: 65px;
  position: absolute;
  right: -83px;
  top: -11px;
}
</style>
