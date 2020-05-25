<template>
  <div class="texts-config">
    <a-tabs defaultActiveKey="1" tabPosition="top" :style="{ height: '100%'}">
      <a-tab-pane tab="公共属性" key="1">
        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->
      </a-tab-pane>

      <a-tab-pane tab="专有属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">
            <a-collapse-panel header="文本样式" key="1">
              <div class="comment-template__item">
                <p class="comment-template__leading">标题文字:</p>
                <div class="comment-template__inner">
                  <a-input
                    v-model="config.proprietaryConfig.series[0].data[0].name"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">标题颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series[0].title.textStyle.color"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">数值颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series[0].detail.textStyle.color"
                    @change="change()"
                  />
                </div>
              </div>

            </a-collapse-panel>

            <a-collapse-panel
              v-for="(header, index) in ['内圈线条样式', '外圈线条样式']"
              :header="header"
              :key="2 + index"
            >

              <template v-if="index === 0">
                <div class="comment-template__item">
                  <p class="comment-template__leading">指针长度(%):</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      v-model="config.proprietaryConfig.series[index].pointer.length"
                      @change="change()"
                    />
                  </div>
                </div>

                <div class="comment-template__item">
                  <p class="comment-template__leading">指针宽度:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      v-model="config.proprietaryConfig.series[index].pointer.width"
                      @change="change()"
                    />
                  </div>
                </div>

                <div class="comment-template__item">
                  <p class="comment-template__leading">指针颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.series[index].data[0].itemStyle.color"
                      @change="change()"
                    />
                  </div>
                </div>
              </template>

              <div class="comment-template__item">
                <p class="comment-template__leading">轴线颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series[index].axisLine.lineStyle.color[0][1]"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item" v-if="index === 0">
                <p class="comment-template__leading">刻度值颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series[index].axisLabel.color"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">刻度颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series[index].axisTick.lineStyle.color"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">刻度线长度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series[index].axisTick.length"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分隔线长度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series[index].splitLine.length"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分隔线宽度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series[index].splitLine.lineStyle.width"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分隔线颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.series[index].splitLine.lineStyle.color"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">分割区间长度:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series[index].splitNumber"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">最小值:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series[index].min"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">最大值:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    v-model="config.proprietaryConfig.series[index].max"
                    @change="change()"
                  />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">仪表半径（%):</p>
                <div class="comment-template__inner">
                  <a-slider
                    :min="10"
                    :max="90"
                    :value="~~config.proprietaryConfig.series[index].radius.replace('%', '')"
                    @change="radiusChange($event, index)"
                  />
                </div>
              </div>
            </a-collapse-panel>

          </a-collapse>
        </div>
      </a-tab-pane>

      <a-tab-pane tab="数据配置" key="4" forceRender>
        <GaugeDataSource />
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../proprietaryMixins'
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
    width: 100px;
    margin: 0;
    text-align: left;
  }
}
</style>
