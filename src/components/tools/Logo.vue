<template>
  <div class="logo">
    <router-link :to="{ name: 'view' }">
      <img :src="logo" alt="" />
      <h1 v-if="showTitle" class="logo__title">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import { ThemeService } from '@/api'

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '统一监控管理平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
      logo: require('@/assets/logo.png')
    }
  },
  methods: {
    async getTheme () {
      // 读取当前主题
      try {
        const { logo } = await ThemeService.fetchTheme()
        if (logo) this.logo = logo
      } catch (error) {
        this.$message.error('主题请求异常!' + error)
      }
    }
  },
  created () {
    this.getTheme()
  }
}
</script>
<style scoped lang="less">
.logo {
  line-height: 1;
  transform: translateY(-2px);

  img {
    width: 62px;
    height: 20px;
  }

  &__title {
    margin: 0 0 0 6px !important;
    font-family: arial, 'Microsoft Yahei', 'Hiragino Sans GB', sans-serif !important;
    font-weight: 100;
    font-size: 16px !important;
    /*font-weight: normal !important;*/
  }
}
</style>
