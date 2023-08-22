<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <!-- fixed header -->
    <!-- <global-header
      v-if="fixedHeader"
      :mode="layoutMode"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :device="device"
      @toggle="toggle"
    /> -->

    <!-- fixed menu -->
    <side-menu
      v-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
    ></side-menu>

    <!-- static content -->
    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">

      <!-- static header -->
      <global-header
        v-if="fixedHeader"
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '64px' : '0' }">
        <multi-tab v-if="showTab"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <!-- <a-layout-footer>
        <global-footer />
      </a-layout-footer> -->

      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      menus: []
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      // SideMenu.width
      if (this.sidebarOpened) {
        return '210px'
      }
      return '80px'
    },
    showTab () {
      const currentPath = this.$route.path
      if (currentPath === '/SecurityMonitoring/SituationalAwareness' || currentPath === '/machineRoom/room') {
        return false
      }
      return true
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      setTimeout(triggerWindowResizeEvent)
      // triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '300px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect () {
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.ant-layout{
  background-color: #F4F4F4 !important;
}

.ant-layout-content{
  padding-top: 66px !important;
  &>:last-child{
    background: #fff;
    border-top: 1px solid #004FA5 !important;
    border-bottom: 1px solid #004FA5 !important;
  }
  &::after{
    display: block;
    content: '';
    height: 24px;
    width: 100%;
  }
}
// 表格相关样式
.ant-table-wrapper{
  padding: 0 23px;
}

.ant-table-header{
  .ant-table-thead > tr > th{
    background-color: #fff !important;
    border-bottom: 1px solid #004FA5 !important;
  }
}

.operation_box{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: space-around;
  justify-content: flex-start;
  height: 50px;
  padding: 0 23px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: #E5EBF3 !important;
  &>:first-child{
    margin-left: 10px;
  }
}

.table_bg{
  background-color: #F9FBFF !important;
}
// 分页器相关
.ant-table-pagination.ant-pagination{
  display: flex;
  margin-top: 0 !important;
  margin-bottom: 23px !important;
  width: 100%;
  padding: 8px;
  background: #E5EBF3;
  justify-content: flex-end;
}

.ant-pagination-item-active{
  border-color: #004FA5 !important;
  background-color: #004FA5 !important;
  a{
    color: #FFF !important;
  }
}

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
