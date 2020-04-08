/**
* 告警列表配置模板
* Author: dong xing
* Date: 2020/4/7
* Time: 11:17
* Email: dong.xing@outlook.com
*/

<template>
  <div class="alarm-list-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="公共属性" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

<!--      <a-tab-pane tab="专有属性" key="2">-->
<!--      </a-tab-pane>-->

      <a-tab-pane tab="数据配置" key="3">
        <AlarmListDataSource />
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common/index'
import ProprietaryMixins from '../proprietaryMixins'
import AlarmListDataSource from '../dataSource/AlarmListDataSource'

export default {
  name: 'AlarmListConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    AlarmListDataSource
  }
}
</script>

<style scoped>

</style>
