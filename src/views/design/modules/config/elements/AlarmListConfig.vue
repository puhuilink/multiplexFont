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
      <a-tab-pane tab="样式" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate :usePadding="false" />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <a-collapse defaultActiveKey="1" :bordered="false">
          <a-collapse-panel header="按钮设置" key="1">
            <div class="comment-template__item">
              <p class="comment-template__leading">背景颜色:</p>
              <div class="comment-template__inner">
                <ColorPicker
                  v-model="config.proprietaryConfig.props.styleConfig.button.backgroundColor"
                  @change="change()" />
              </div>
            </div>
            <div class="comment-template__item">
              <p class="comment-template__leading">字体颜色:</p>
              <div class="comment-template__inner">
                <ColorPicker
                  v-model="config.proprietaryConfig.props.styleConfig.button.color"
                  @change="change()" />
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <ListProprietaryConfig />
      </a-tab-pane>

      <a-tab-pane tab="数据" key="3">
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
import ColorPicker from '@/components/ColorPicker'
import ListProprietaryConfig from '../common/ListProprietaryConfig'

export default {
  name: 'AlarmListConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    AlarmListDataSource,
    ColorPicker,
    ListProprietaryConfig
  }
}
</script>

<style scoped>

</style>
