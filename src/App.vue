<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  }
}
</script>
<style lang="less">
  @import 'assets/less/common';
  #app {
    height: 100%;
  }
  .ant-drawer-content-wrapper{
    width: 300px !important;
  }
  .opration{
    margin-bottom: 10px;
    button{
      margin-right: 5px;
    }
}
</style>
