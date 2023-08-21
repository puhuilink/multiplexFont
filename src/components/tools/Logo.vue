<template>
  <div class="logo" :class="showTitle?'detail_logo':'simple_logo'">
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
.detail_logo{
  padding: 12px !important;
  padding-right: 0 !important;
  box-sizing: border-box !important;
}
.simple_logo{
  left:50% !important;
  margin: 12px;
  margin-left: -40px !important;
}
.logo {
  background-color: transparent !important;
  div{
    display: flex;
    align-items: center;
  }

  img {
    height: 40px !important;
  }
  span{
    display: flex;
    flex-direction: column;
    white-space: nowrap;
  }
  &__title {
    font-size: 18px !important;
    line-height: 26px !important;
    font-family: FZZZHUNHJW--GB1-0, arial, 'Microsoft Yahei', 'Hiragino Sans GB', sans-serif !important;
    font-weight: normal !important;
  }
  &__subtitle{
    font-size: 14px !important;
    line-height: 14px !important;
    letter-spacing: 1.1px;
    font-family: FZZZHUNHJW--GB1-0, FZZZHUNHJW--GB1 !important;
    font-weight: normal !important;
    color: #FFFFFF;
  }
}
</style>
