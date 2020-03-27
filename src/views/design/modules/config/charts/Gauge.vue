<template>
  <div class="texts-config">
    <a-tabs defaultActiveKey="3" tabPosition="top" :style="{ height: '100%'}">
      <a-tab-pane tab="公共属性" key="">
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
                <p class="comment-template__leading">最小值:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series.min"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">最大值:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series.max"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">仪表半径:</p>
                <div class="comment-template__inner">
                  <a-slider
                    :min="10"
                    :max="90"
                    tooltipVisible
                    :value="~~config.proprietaryConfig.series.radius.replace('%', '')"
                    @change="radiusChange"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">刻度区间:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series.max"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">刻度线长度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series.axisTick.length"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">刻度线颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series.axisTick.lineStyle.color"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分割线长度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series.splitLine.length"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分隔线颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series.splitLine.lineStyle.color"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分割区间长度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series.splitNumber"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">标题文字:</p>
                <div class="comment-template__inner">
                  <a-input
                    v-model="config.proprietaryConfig.series.data[0].name"
                    @change="change()"
                  />
                </div>
              </div>
              <!--
              数值名称
              刻度线颜色
              分割线颜色
              -->
            </a-collapse-panel>
            <!-- E 文本样式 -->
          </a-collapse>
        </div>
      </a-tab-pane>

      <a-tab-pane tab="数据配置" key="3" forceRender>
        <GaugeDataSource
          :value="config.dataConfig.dbDataConfig"
          @changeDynamicDataConfig="changeDynamicDataConfig"
        />
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../propietaryMixins'
import ColorPicker from '@/components/ColorPicker'
import GaugeDataSource from '../dataSource/GaugeDataSource'

export default {
  name: 'Gauge',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ColorPicker,
    GaugeDataSource
  },
  methods: {
    radiusChange (value) {
      this.config.proprietaryConfig.series.radius = `${value}%`
      this.change()
    },
    changeDynamicDataConfig (e) {
      this.config.dataConfig.dbDataConfig = Object.assign({}, e)
      // this.change()
    }
  }
}
</script>

<style scoped lang="less">
</style>
