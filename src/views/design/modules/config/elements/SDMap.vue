<template>
  <div class="texts-config">
    <a-tabs defaultActiveKey="1" tabPosition="top" :style="{ height: '100%'}">
      <a-tab-pane tab="样式" key="1">
        <!-- S 公共配置模板 -->
        <CommonTemplate :usePadding="false" />
        <!-- E 公共配置模板 -->
      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <div class="circle-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">
            <a-collapse-panel header="样式" key="1">
              <div class="comment-template__item">
                <p class="comment-template__leading">地图底图背景颜色</p>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.backgroundColor"
                    @change="change"
                  ></ColorPicker>
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">版图颜色</p>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.areaColor"
                    @change="change"
                  ></ColorPicker>
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">移入版图颜色</p>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.hoverColor"
                    @change="change"
                  ></ColorPicker>
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">版图边缘颜色</p>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.borderColor"
                    @change="change"
                  ></ColorPicker>
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">连线颜色渐变</p>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.lineColor[0]"
                    @change="change"
                  ></ColorPicker>
                </div>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.lineColor[1]"
                    @change="change"
                  ></ColorPicker>
                </div>
              </div>
              <div class="comment-template__item">
                <p class="comment-template__leading">版图文字颜色</p>
                <div class="comment-template__inner comment-template__end">
                  <ColorPicker
                    v-model="config.proprietaryConfig.fontColor"
                    @change="change"
                  ></ColorPicker>
                </div>
              </div>
            </a-collapse-panel>
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
  name: 'SDMapConfig',
  mixins: [ProprietaryMixins],
  data () {
    return {
    }
  },
  components: {
    CommonTemplate,
    ColorPicker
  },
  methods: {
    radiusChange (value, index) {
      this.config.proprietaryConfig.series[index].radius = `${value}%`
      this.change()
    }
  }
}
</script>

<style scoped lang="less">
.comment-template {
  &__leading {
    flex: none;
    width: 90px;
    margin: 0;
    text-align: left;
  }
}
</style>
