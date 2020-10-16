<template>
  <a-layout>
    <a-layout-content>
      <a-layout class="Setting">
        <a-layout-sider width="200">
          <a-menu
            mode="inline"
            :default-selected-keys="$route.path.includes('base')?['base']:['security']"
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

<style lang="less">
.Setting {
  padding: 24px 0;
  background: #fff;
  height: 80vh;
  &__menu {
    height: 80vh;
  }
  &__content{
    padding: 0 24px;
  }
}
</style>
