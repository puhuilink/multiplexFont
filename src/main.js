import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import apolloProvider from './utils/apollo'
import './plugins'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission'
import './utils/filter'
import './components/global.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created: bootstrap,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
