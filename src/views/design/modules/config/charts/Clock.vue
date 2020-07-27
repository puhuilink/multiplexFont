<template>
  <div class="texts-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="公共属性" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate :usePadding="false" />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="专有属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">

            <!-- S 文本样式 -->
            <a-collapse-panel header="文本样式" key="1">

              <!-- 时间格式 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">格式:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    defaultValue="YYYY-MM-DD HH:mm:ss"
                    v-model="config.proprietaryConfig.format"
                    @change="change">
                    <a-select-option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</a-select-option>
                    <a-select-option value="YYYY-MM-DD">YYYY-MM-DD</a-select-option>
                    <a-select-option value="HH:mm:ss">HH:mm:ss</a-select-option>
                  </a-select>
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.title.textStyle.color"
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
                    v-model.number="config.proprietaryConfig.title.textStyle.fontSize" />
                </div>
              </div>
              <!-- / 大小 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">粗细:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.title.textStyle.fontWeight"
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
                    v-model="config.proprietaryConfig.title.textStyle.fontStyle"
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
                    v-model="config.proprietaryConfig.title.position.mode"
                    @change="positionChange">
                    <a-select-option value="center">水平垂直居中</a-select-option>
                    <a-select-option value="center_left">垂直居中-居左</a-select-option>
                    <a-select-option value="center_right">垂直居中-居右</a-select-option>
                    <a-select-option value="top_center">居上-水平居中</a-select-option>
                    <a-select-option value="bottom_center">居下-水平居中</a-select-option>
                    <a-select-option value="custom">自定义</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 位置 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('left')">
                <p class="comment-template__leading">居左:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.left" />
                </div>
              </div>
              <!-- / 居左 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('right')">
                <p class="comment-template__leading">居右:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.right" />
                </div>
              </div>
              <!-- / 居右 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('top')">
                <p class="comment-template__leading">居上:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.top" />
                </div>
              </div>
              <!-- / 居上 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('bottom')">
                <p class="comment-template__leading">居下:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.bottom" />
                </div>
              </div>
              <!-- / 居下 -->

            </a-collapse-panel>
            <!-- E 文本样式 -->

          </a-collapse>
        </div>
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../proprietaryMixins'
import ColorPicker from '@/components/ColorPicker'

export default {
  name: 'Clock',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ColorPicker
  },
  methods: {
    positionChange () {
      const { position } = this.config.proprietaryConfig.title
      switch (position.mode) {
        case 'center':
          Object.assign(position, { editablePosition: [] })
          break
        case 'center_left':
          Object.assign(position, { editablePosition: ['left'], left: 0 })
          break
        case 'center_right':
          Object.assign(position, { editablePosition: ['right'], right: 0 })
          break
        case 'top_center':
          Object.assign(position, { editablePosition: ['top'], top: 0 })
          break
        case 'bottom_center':
          Object.assign(position, { editablePosition: ['bottom'], bottom: 0 })
          break
        case 'custom':
          Object.assign(position, {
            editablePosition: ['top', 'bottom', 'left', 'right'],
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          })
          break
        default:
          Object.assign(position, { editablePosition: [] })
          break
      }
      this.change()
    }
  }
}
</script>

<style scoped lang="less">
</style>
