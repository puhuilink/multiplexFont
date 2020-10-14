<template>
  <a-layout>
    <a-layout-content>
      <a-layout class="Setting__content-layout">
        <a-layout-sider width="200">
          <a-menu
            mode="inline"
            :default-selected-keys="selectedKeys"
            class="Setting__content-layout-menu"
          >
            <a-menu-item key="base">
              <router-link to="/settings/base">基本设置</router-link>
            </a-menu-item>
            <a-menu-item key="security">
              <router-link to="/settings/security">安全设置</router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
          <router-view/>
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
  created () {
    if (this.$route.path.includes('base')) {
      this.selectedKeys = ['base']
    } else {
      this.selectedKeys = ['security']
    }
  }
}
</script>

<style lang="less" >
.Setting{
  &__content{
    padding: 0 50px;
    &-layout{
      padding: 24px 0;
      background: #fff;
      height: 85vh;
      &-menu{
        height: 100vh;
      }
    }
  }
}
</style>
