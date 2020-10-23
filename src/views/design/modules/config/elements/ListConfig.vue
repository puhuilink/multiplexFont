<template>
  <div class="alarm-list-config">
    <a-tabs
      defaultActiveKey="3"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="样式" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">
            <a-collapse-panel header="表头设置" key="1">
              <div class="comment-template__item">
                <p class="comment-template__leading">背景颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.props.styleConfig.header.backgroundColor"
                    @change="change()" />
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">字体颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.props.styleConfig.header.color"
                    @change="change()" />
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">字体大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    v-model="config.proprietaryConfig.props.styleConfig.header.fontSize"
                    @change="change()"
                  />
                </div>
              </div>
              <!-- / 字体大小 -->

            </a-collapse-panel>
            <!-- / 表头设置 -->

            <a-collapse-panel header="表行设置" key="2">
              <div class="comment-template__item">
                <p class="comment-template__leading">背景颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.props.styleConfig.rows.backgroundColor"
                    @change="change()" />
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">字体颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.props.styleConfig.rows.color"
                    @change="change()" />
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">字体大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    v-model="config.proprietaryConfig.props.styleConfig.rows.fontSize"
                    @change="change()"
                  />
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">粗细:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.props.styleConfig.rows.fontWeight"
                    @change="change">
                    <a-select-option value="normal">正常</a-select-option>
                    <a-select-option value="lighter">细</a-select-option>
                    <a-select-option value="bold">粗</a-select-option>
                    <a-select-option value="bolder">更粗</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-collapse-panel>
            <!-- <a-collapse-panel header="边框设置" key="3">
              <div class="comment-template__item">
                <p class="comment-template__leading">单元内边框:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.props.styleConfig.rows.fontSize"
                    @change="change()"
                  />
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">字体大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.props.styleConfig.rows.fontSize"
                    @change="change()"
                  />
                </div>
              </div>
            </a-collapse-panel> -->
            <a-collapse-panel header="其他设置" key="3">
              <div class="comment-template__item">
                <p class="comment-template__leading">对齐设置:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="config.proprietaryConfig.props.styleConfig.align"
                    @change="change">
                    <a-select-option value="left">左对齐</a-select-option>
                    <a-select-option value="center">居中</a-select-option>
                    <a-select-option value="right">右对齐</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
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
import ColorPicker from '@/components/ColorPicker'

export default {
  name: 'ListConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ListDataSource,
    ColorPicker
  }
}
</script>

<style scoped>

</style>
