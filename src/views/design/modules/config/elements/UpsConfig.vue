<template>
  <div class="alarm-list-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="样式" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate :usePadding="false" />
        <!-- E 公共配置模板 -->

      </a-tab-pane>
      <a-tab-pane tab="属性" key="2">
        <UpsProprietaryConfig />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import UpsProprietaryConfig from '@/views/design/modules/config/common/UpsProprietaryConfig'
import ProprietaryMixins from '@/views/design/modules/config/proprietaryMixins/index'
import CommonTemplate from '../common/index'
export default {
  name: 'UpsConfig',
  mixins: [ProprietaryMixins],
  components: {
    UpsProprietaryConfig,
    CommonTemplate
  }
}
</script>

<style scoped>

</style>
