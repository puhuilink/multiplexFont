<template>
  <div class="logo">
    <router-link :to="{ name: 'view' }">
      <div>
        <img :src="logo" alt="" />
        <span>
          <h1 v-show="showTitle" class="logo__title">机 房 运 维 安 全</h1>
          <h1 v-show="showTitle" class="logo__subtitle">一 体 化 管 理 系 统</h1>
        </span>
      </div>
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
      default: '机房运维安全管控系统',
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
      logo: require('@/assets/images/title.png'),
      titleName: ''
    }
  },
  methods: {
    async getTheme () {
      // 读取当前主题
      try {
        const { logo, name } = await ThemeService.fetchTheme()
        if (logo) this.logo = logo
        if (name) this.titleName = name
      } catch (error) {
        this.$message.error('主题请求异常!' + error)
      }
    }
  },
  created () {
    // this.getTheme()
  }
}
</script>
<style scoped lang="less">
@font-face {
  font-family: 'FZZZHUNHJW--GB1-0';
  src: url('../../assets/fonts/FZZZHUNHJW.ttf') format('truetype');
}
.logo {
  transform: translateY(-2px);
  div{
    display: flex;
    align-items: center;
    height: 65px;
  }

  img {
    height: 42px !important;
  }
  span{
    display: flex;
    flex-direction: column;
  }
  &__title {
    font-size: 16px !important;
    line-height: 16px !important;
    font-family: FZZZHUNHJW--GB1-0, arial, 'Microsoft Yahei', 'Hiragino Sans GB', sans-serif !important;
    font-weight: normal !important;
    margin: 0 0 0 12px !important;
  }
  &__subtitle{
    font-size: 12px !important;
    line-height: 16px !important;
    letter-spacing: 2px;
    font-family: FZZZHUNHJW--GB1-0, FZZZHUNHJW--GB1 !important;
    font-weight: normal !important;
    color: #FFFFFF;
    margin: 0 0 0 12px !important;
  }
}
</style>
