<template>
  <a-layout>
    <a-layout-content>
      <a-layout class="Setting">
        <a-layout-sider width="200">
          <a-menu
            mode="inline"
            :default-selected-keys="selectedKeys"
            class="Setting__menu"
          >
            <a-menu-item key="base">
              <router-link to="/settings/base">基本设置</router-link>
            </a-menu-item>

            <a-menu-item key="security">
              <router-link to="/settings/security">安全设置</router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <a-layout-content class="Setting__content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      selectedKeys: []
    }
  },
  // 根据地址指向当前菜单
  created () {
    if (this.$route.path.includes('base')) {
      this.selectedKeys = ['base']
    } else {
      this.selectedKeys = ['security']
    }
  }
}
</script>

<style lang="less">
.Setting {
  padding: 24px 0;
  background: #fff;
  height: 85vh;
  &__menu {
    height: 100vh;
  }
  &__content{
    padding: 0 24px;
  }
}
</style>
