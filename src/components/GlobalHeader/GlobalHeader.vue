<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
        :style="{ padding: '0' }">
        <div v-if="mode === 'sidemenu'" class="header">
          <!-- <Logo v-if="fixedHeader" class="header-logo" /> -->
          <a-icon v-if="device==='mobile'" class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle"/>
          <a-icon v-else class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggle"/>
          <user-menu></user-menu>
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item v-for="(item, index) of $route.matched" :key="index">
              <router-link v-if="index!==0 || $route.matched.length!==2" :to="item.path" >{{ item.meta.title }}</router-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'"/>
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme" />
              <a-icon v-else class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle" />
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data () {
    return {
      visible: true,
      oldScrollTop: 0
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
    console.log(this.$route.path)
  },
  methods: {
    handleScroll () {
      if (!this.autoHideHeader) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  },
  beforeDestroy () {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less">
@import '../index.less';
.ant-layout-sider{
  background-color: #0E283F !important;
}
.ant-menu-dark, .ant-menu-dark .ant-menu-sub{
  background-color: #153D60 !important;
}
.ant-menu{
  background-color: #0E283F !important;
}
.ant-menu-item-selected{
  background-color: #004FA5 !important;
  &::before{
    display: inline-block;
    position: absolute;
    left: 0;
    width: 4px;
    height: 100%;
    content: '';
    background-color: #4A8BD2 !important;
  }
}
.breadcrumb{
  display: inline-block;
  > span:last-child a{
    color: #004FA5 !important;
  }
  a{
    font-family: MicrosoftYaHei !important;
    color: #333333 !important;
  }
  .ant-breadcrumb-separator {
    margin: 0 4px;
    font-size: 18px;
    color: rgba(0, 0, 0, 1) !important;
}
}
.ant-header-fixedHeader {
  position: fixed;
  top: 0;
  right: 0;
  // left: 0;
  height: 64px;
  z-index: 199;
  background: transparent !important;
}

.ant-header-side-opened{
  width: calc(100% - 210px) !important;
}
.ant-header-side-close{
  width: calc(100% - 80px) !important;
}
.header-logo {
  display: inline-block;
  padding: 12px 20px;

  h1 {
    display: inline-block;
  }
}

.header-animat{
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  height: 0;
  transition: all 0.25s ease;
}
.showHeader-enter, .showHeader-leave-to {
  opacity: 0;
}
</style>
