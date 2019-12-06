<template>
  <div class="logo">
    <router-link :to="{name:'view'}">
      <img src="~@/assets/logo.png" alt="">
      <h1 v-if="showTitle" class="logo__title">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '中交 · 统一监控管理平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style scoped lang="less">
.logo {
  &__title {
    margin: 0 0 0 6px !important;
    font-size: 16px !important;
    font-weight: normal !important;
  }
}
</style>
