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
        <ListProprietaryConfig />
      </a-tab-pane>

      <a-tab-pane tab="数据" key="3">
        <ListDataSource />
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common/index'
import ProprietaryMixins from '../proprietaryMixins'
import ListDataSource from '../dataSource/ListDataSource'
import ListProprietaryConfig from '../common/ListProprietaryConfig'

export default {
  name: 'ListConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ListDataSource,
    ListProprietaryConfig
  }
}
</script>

<style scoped>

</style>
