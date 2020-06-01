/*
 * 环度vue
 */
<template>
  <div class="texts-config">
    <a-tabs defaultActiveKey="2" tabPosition="top" :style="{ height: '100%'}">
      <a-tab-pane tab="公共属性" key="1">
        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->
      </a-tab-pane>

      <a-tab-pane tab="专有属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">
            <a-collapse-panel header="类型设置" key="1">
              <div class="comment-template__item">
                <p class="comment-template__leading">类型:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="chartsType"
                    @change="chartsTypeChange">
                    <a-select-option value="healthDegree">健康度</a-select-option>
                    <a-select-option value="healthRing">健康环</a-select-option>
                    <a-select-option value="progressRing">进度环</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 类型 -->
            </a-collapse-panel>

            <!-- S 文字设置 -->
            <a-collapse-panel header="数值设置" key="2" v-if="chartsType">

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
                    v-model="config.proprietaryConfig.innerCircle.label.color"
                    @change="change()" />
                </div>
              </div>
              <!-- / 字体颜色 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">小数位数:</p>
                <div class="comment-template__inner">
                  <a-slider
                    v-model="decimalPoint"
                    @change="change()"
                    :min="0"
                    :max="4" />
                </div>
              </div>
              <!-- / 小数点保留 -->

              <!-- <div class="comment-template__item">
                <p class="comment-template__leading">区段:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="zone"
                    @change="change" />
                </div>
              </div> -->
              <!-- / 数值区段 -->

              <!-- <div class="comment-template__item">
                <p class="comment-template__leading">区段颜色:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="zoneColor"
                    @change="change" />
                </div>
              </div> -->
              <!-- / 区段颜色 -->
            </a-collapse-panel>
            <!-- E 文字 -->

            <a-collapse-panel header="底色设置" key="3">
              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.innerCircle.backgroundStyle.color"
                    @change="change" />
                </div>
              </div>
            </a-collapse-panel>

            <a-collapse-panel header="圆设置" key="4" v-if="chartsType==='healthDegree'">
              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.innerCircle.itemStyle.color"
                    @change="change" />
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

            <a-collapse-panel header="环设置" key="5" v-if="chartsType!=='healthDegree'">
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

            <a-collapse-panel header="刻度设置" key="6" v-if="chartsType">
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
              <div v-if="config.proprietaryConfig.innerCircle.outline.show">

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

      <a-tab-pane tab="数据配置" key="3" forceRender>
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
import _ from 'lodash'

export default {
  name: 'DegreeRingConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ColorPicker,
    DegreeRingDataSource
  },
  data: () => ({
    chartsType: 'healthDegree'
  }),
  computed: {
    decimalPoint: {
      get () {
        return _.get(this, 'config.proprietaryConfig.decimalPoint', 0)
      },
      set (decimalPoint) {
        Object.assign(this.config.proprietaryConfig, { decimalPoint })
      }
    }
  },
  methods: {
    chartsTypeChange (value) {
      switch (value) {
        case 'healthDegree':
          this.config.proprietaryConfig.innerCircle.data = [1]
          this.config.proprietaryConfig.innerCircle.label.color = '#fff'
          this.config.proprietaryConfig.innerCircle.itemStyle.opacity = 1
          break
        case 'progressRing':
          this.config.proprietaryConfig.innerCircle.backgroundStyle.borderWidth = 8
          break
        case 'healthRing':
          this.config.proprietaryConfig.innerCircle.backgroundStyle.borderWidth = 8
          break
      }
      if (value !== 'healthDegree') {
        this.config.proprietaryConfig.innerCircle.data = [0]
        this.config.proprietaryConfig.innerCircle.label.color = '#000'
        this.config.proprietaryConfig.innerCircle.itemStyle.opacity = 0
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
