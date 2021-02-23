/*
 * 环度vue
 */
<template>
  <div class="texts-config">
    <a-tabs defaultActiveKey="1" tabPosition="top" :style="{ height: '100%'}">
      <a-tab-pane tab="样式" key="1">
        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->
      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <div class="texts-config__template">
          <a-collapse :activeKey="['1', '2', '3']" :bordered="false">
            <a-collapse-panel header="类型设置" key="1">
              <div class="comment-template__item">
                <p class="comment-template__leading">类型:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="config.proprietaryConfig.type"
                    @change="typeChange">
                    <a-select-option :value="DEGREE_TYPE_HEALTH_DEGREE">健康度</a-select-option>
                    <a-select-option :value="DEGREE_TYPE_HEALTH_RING">健康环</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-collapse-panel>
            <!-- / 类型 -->

            <!-- S 文字设置 -->
            <a-collapse-panel header="数值设置" key="2">

              <div class="comment-template__item">
                <p class="comment-template__leading">字体大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.innerCircle.label.fontSize"
                    @change="change()"
                  />
                </div>
              </div>
              <!-- / 字体大小 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">字体颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.innerCircle.label.insideColor"
                    @change="change()" />
                </div>
              </div>
              <!-- / 字体颜色 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">小数位数:</p>
                <div class="comment-template__inner">
                  <a-slider
                    v-model="config.proprietaryConfig.innerCircle.decimalPoint"
                    @change="change()"
                    :min="-1"
                    :max="4" />
                </div>
              </div>
              <!-- / 小数点保留 -->

              <ThresholdColor />
            </a-collapse-panel>

            <a-collapse-panel header="底色设置" key="3" v-show="config.proprietaryConfig.type === DEGREE_TYPE_HEALTH_RING">
              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.innerCircle.backgroundStyle.color"
                    @change="change()" />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">透明度:</p>
                <div class="comment-template__inner">
                  <a-slider
                    v-model="config.proprietaryConfig.innerCircle.backgroundStyle.opacity"
                    @change="change()"
                    :min="0"
                    :max="1"
                    :step="0.1"
                  />
                </div>
              </div>
            </a-collapse-panel>

            <a-collapse-panel header="圆设置" key="4" v-show="config.proprietaryConfig.type === DEGREE_TYPE_HEALTH_DEGREE">
              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.innerCircle.itemStyle.color"
                    @change="change()" />
                </div>
              </div>
              <!-- / 颜色 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">半径:</p>
                <div class="comment-template__inner">
                  <a-slider
                    :min="10"
                    :max="90"
                    tooltipVisible
                    :value="~~config.proprietaryConfig.innerCircle.radius.replace('%', '')"
                    @change="radiusChange"
                  />
                </div>
              </div>
            </a-collapse-panel>

            <a-collapse-panel header="环设置" key="5" v-show="config.proprietaryConfig.type === DEGREE_TYPE_HEALTH_RING">
              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.innerCircle.backgroundStyle.borderColor"
                    @change="change" />
                </div>
              </div>
              <!-- / 颜色 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">半径:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.innerCircle.backgroundStyle.borderWidth"
                    @change="change"
                  />
                </div>
              </div>
            </a-collapse-panel>

            <a-collapse-panel header="刻度设置" key="6">
              <div class="comment-template__item">
                <p class="comment-template__leading">显示:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-switch
                    checkedChildren="显示"
                    unCheckedChildren="不显示"
                    v-model="config.proprietaryConfig.innerCircle.outline.show"
                    @change="change" />
                </div>
              </div>
              <!-- / 显示 -->
              <div v-show="config.proprietaryConfig.innerCircle.outline.show">

                <div class="comment-template__item">
                  <p class="comment-template__leading">类型:</p>
                  <div class="comment-template__inner comment-template__end">
                    <a-radio-group
                      buttonStyle="solid"
                      v-model="config.proprietaryConfig.innerCircle.outline.itemStyle.borderType"
                      @change="change">
                      <a-radio-button value="dashed">虚线</a-radio-button>
                      <a-radio-button value="solid">实线</a-radio-button>
                    </a-radio-group>
                  </div>
                </div>
                <!-- / 类型 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.innerCircle.outline.itemStyle.borderColor"
                      @change="change"/>
                  </div>
                </div>
                <!-- / 颜色 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">宽度:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      v-model="config.proprietaryConfig.innerCircle.outline.itemStyle.borderWidth"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 宽度 -->
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-tab-pane>

      <a-tab-pane tab="数据" key="3" forceRender>
        <DegreeRingDataSource />
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../proprietaryMixins'
import ColorPicker from '@/components/ColorPicker'
import DegreeRingDataSource from '../dataSource/DegreeRingDataSource'
import ThresholdColor from '../common/ThresholdColor'
import {
  DEGREE_TYPE_HEALTH_DEGREE,
  DEGREE_TYPE_HEALTH_RING
} from '@/model/config/proprietaryConfigs/DegreeRingProprietaryConfig'

export default {
  name: 'DegreeRingConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ColorPicker,
    DegreeRingDataSource,
    ThresholdColor
  },
  data: () => ({
    DEGREE_TYPE_HEALTH_DEGREE,
    DEGREE_TYPE_HEALTH_RING
  }),
  computed: {},
  methods: {
    typeChange (value) {
      switch (value) {
        case DEGREE_TYPE_HEALTH_DEGREE:
          this.config.proprietaryConfig.innerCircle.itemStyle.opacity = 1
          break
        case DEGREE_TYPE_HEALTH_RING:
          this.config.proprietaryConfig.innerCircle.itemStyle.opacity = 0
          break
      }
      this.change()
    },
    radiusChange (value) {
      this.config.proprietaryConfig.innerCircle.radius = `${value}%`
      this.change()
    }
  }
}
</script>

<style scoped lang="less">
  .chart-proprietary-template {
    height: calc(100vh - 224px);
    overflow: auto;
  }
</style>
