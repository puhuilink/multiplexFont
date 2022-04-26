<template>
  <div class="select-config">
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
        <div class="texts-config__template">
          <div class="comment-template__item">
            <p class="comment-template__leading">框体大小:</p>
            <div class="comment-template__inner">
              <a-select
                v-model="config.proprietaryConfig.props.styleConfig.size"
                style="width: 100%"
                @change="change">
                <a-select-option value="large">
                  大
                </a-select-option>
                <a-select-option value="default">
                  默认
                </a-select-option>
                <a-select-option value="small">
                  小
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="comment-template__item">
            <p class="comment-template__leading">类型:</p>
            <div class="comment-template__inner">
              <a-input
                v-model="config.proprietaryConfig.props.styleConfig.type"
                style="width: 100%"
                @change="change">
              </a-input>
            </div>
          </div>
          <div class="comment-template__item">
            <p class="comment-template__leading">默认值:</p>
            <div class="comment-template__inner">
              <a-input
                v-model="config.proprietaryConfig.props.styleConfig.defaultValue"
                style="width: 100%"
                @change="change">
              </a-input>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common/index'
import ProprietaryMixins from '@/views/design/modules/config/proprietaryMixins'
export default {
  name: 'SelectConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate
  }
}
</script>

<style scoped>

</style>
