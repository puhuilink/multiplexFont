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
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">

            <!-- S 文本样式 -->
            <a-collapse-panel header="文本样式" key="1">

              <div class="comment-template__item">
                <p class="comment-template__leading">文本:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.props.styleConfig.text"
                    @change="change" />
                </div>
              </div>
              <!-- / 文本 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.props.styleConfig.textStyle.color"
                    @change="change()" />
                </div>
              </div>
              <!-- / 颜色 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.props.styleConfig.textStyle.fontSize" />
                </div>
              </div>
              <!-- / 大小 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">粗细:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.props.styleConfig.textStyle.fontWeight"
                    @change="change">
                    <a-select-option value="normal">正常</a-select-option>
                    <a-select-option value="lighter">细</a-select-option>
                    <a-select-option value="bold">粗</a-select-option>
                    <a-select-option value="bolder">更粗</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 粗细 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">风格:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.props.styleConfig.textStyle.fontStyle"
                    @change="change">
                    <a-select-option value="normal">正常</a-select-option>
                    <a-select-option value="italic">斜体</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 风格 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">位置:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="config.proprietaryConfig.props.styleConfig.position.mode"
                    @change="change">
                    <a-select-option value="center">水平垂直居中</a-select-option>
                    <a-select-option value="center_left">垂直居中-居左</a-select-option>
                    <a-select-option value="center_right">垂直居中-居右</a-select-option>
                    <a-select-option value="top_center">居上-水平居中</a-select-option>
                    <a-select-option value="top_left">居上-居左</a-select-option>
                    <a-select-option value="top_right">居上-居右</a-select-option>
                    <a-select-option value="bottom_center">居下-水平居中</a-select-option>
                    <a-select-option value="bottom_left">居下-居左</a-select-option>
                    <a-select-option value="bottom_right">居下-居右</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 位置 -->
              <!-- / 居下 -->

            </a-collapse-panel>
            <a-collapse-panel header="弹窗内容" key="2">

              <div class="comment-template__item">
                <p class="comment-template__leading">类型</p>
                <div class="comment-template__inner">
                  <a-select
                    type="text"
                    v-model="config.proprietaryConfig.props.styleConfig.type"
                    @change="change" >
                    <a-select-option value="alarm">告警列表</a-select-option>
                    <a-select-option value="tab">标签列表</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-collapse-panel>
            <!-- E 文本样式 -->

          </a-collapse>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="数据" key="3">
        <MoreDataSource />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import ProprietaryMixins from '@/views/design/modules/config/proprietaryMixins/index'
import CommonTemplate from '../common/index'
import ColorPicker from '~~~/ColorPicker'
import MoreDataSource from '../dataSource/MoreDataSource'
export default {
  name: 'MoreConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ColorPicker,
    MoreDataSource
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
