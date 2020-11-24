import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less'
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import _ from 'lodash'

NProgress.configure({ showSpinner: false })

const allowRouteNameList = ['login', 'Design', 'Preview']

router.beforeEach((to, from, next) => {
  NProgress.start()

  // 设置页面标题为当前页面
  _.get(to, ['meta', 'title']) && setDocumentTitle(`${to.meta.title} - ${domTitle}`)

  // 白名单直接进入
  if (allowRouteNameList.includes(to.name)) {
    return next()
  }

  // 未登录重定向到登录
  if (!Vue.ls.get(ACCESS_TOKEN)) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 已登录并初始化路由权限
  if (!_.isEmpty(store.getters.roles)) {
    return next()
  }

  // 已登录但未初始化路由权限
  store
    .dispatch('GetInfo')
    .then(roles => store.dispatch('GenerateRoutes', { roles }))
    .then(() => {
      // 根据 roles 权限生成并添加可访问的路由表
      router.addRoutes(store.getters.addRouters)
      const redirect = decodeURIComponent(from.query.redirect || to.path)
      if (to.path === redirect) {
        next({ ...to, replace: true })
      } else {
        next({ path: redirect })
      }
    })
    .catch((err) => {
      notification.error({
        message: '页面跳转异常',
        description: err.message
      })
      store
        .dispatch('Logout')
        .finally(() => {
          next({ name: 'login', query: { redirect: to.fullPath } })
        })
      throw err
    })
})

router.afterEach(() => {
  NProgress.done()
})
