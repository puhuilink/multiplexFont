// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import apolloProvider from './utils/apollo'
import { VueAxios } from './utils/request'
import { loginOld } from '@/api/controller/User'
import './plugins'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// TODO: judge whether env is development or production
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './core/vue_rx'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'

// 引入音频文件
import audio from './assets/MINOR.mp3'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

// TODO: 此处为兼容老系统 api，开发时开启
loginOld().then()

new Vue({
  router,
  store,
  created: bootstrap,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')

/**
 * 注册播放音频事件到Vue实例上
 */
Vue.prototype.clickAudio = () => {
  const buttonAudio = document.getElementById('eventAudio')
  buttonAudio.setAttribute('src', audio)
  buttonAudio.play()
}

/**
 * 暂停音频播放
 */
Vue.prototype.pauseAudio = () => {
  const buttonAudio = document.getElementById('eventAudio')
  buttonAudio.setAttribute('src', audio)
  buttonAudio.pause()
}

/* Vue.prototype.acStateColorFilter = (type) => {
  type += ''
  switch (type) {
    case 'pending':
      return '#c4c4c4'
    case 'confirmed':
      return '#00aaff'
    case 'shifting':
      return '#f99025'
    case 'resolved':
      return '#39cc39'
    case 'ignore':
      return '#000000'
    default:
      return ''
  }
} */
