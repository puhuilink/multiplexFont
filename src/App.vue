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
import { UserService } from '@/apiV2'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  async mounted () {
    await UserService.batchDelete(['thx_api_test'])
    // UserApi.batchDelete(['thx_api_test'])
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
.ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group{
  display:none !important
}

// 操作按钮样式
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
// 搜索框样式
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
