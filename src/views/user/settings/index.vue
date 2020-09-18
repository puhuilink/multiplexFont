<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-content style="padding: 0 50px">
      <a-layout class="setting-index-A-layout">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            mode="inline"
            :default-selected-keys="selectedKeys"
            style="height: 100%"
          >
            <a-menu-item key="1">
              <router-link to="/settings/base">基本设置</router-link>
            </a-menu-item>
            <a-menu-item key="2">
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
  data () {
    return {
      selectedKeys: []
    }
  },
  created () {
    if (window.location.href.includes('base')) {
      this.selectedKeys = ['1']
    } else {
      this.selectedKeys = ['2']
    }
  }
}
</script>

<style>
.setting-index-A-layout{
       padding: 24px 0;
       background: #fff;height: 85vh;
}
</style>
