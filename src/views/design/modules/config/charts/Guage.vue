<template>
  <div class="texts-config">
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

      <a-tab-pane tab="专有属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">

            <!-- S 文本样式 -->
            <a-collapse-panel header="文本样式" key="1">

              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series.axisTick.lineStyle.color"
                    @change="change()" />
                </div>
              </div>

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
import ProprietaryMixins from '../propietaryMixins'
import ColorPicker from '@/components/ColorPicker'

export default {
  name: 'Guage',
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
