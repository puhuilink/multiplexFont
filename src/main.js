// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'

// 引入音频文件
import audio from './assets/MINOR.mp3'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  created: bootstrap,
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
