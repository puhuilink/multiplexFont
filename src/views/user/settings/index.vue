<template>
  <div>
    <a-tabs default-active-key="base">
      <a-tab-pane key="base" tab="基本设置">
        <BaseSettings/>
      </a-tab-pane>
      <a-tab-pane key="security" tab="安全设置">
        <SecuritySettings/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import BaseSettings from './modules/BaseSettings'
import SecuritySettings from './modules/SecuritySettings'
export default {
  name: 'Setting',
  components: {
    BaseSettings,
    SecuritySettings
  }
}
</script>
