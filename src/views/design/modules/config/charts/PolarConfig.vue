/**
* 极坐标配置
* Date: 2020/5/15
* Time: 5:19 下午
*/

<template>
  <div class="polar-config">
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

        <!-- S 专有配置模板 -->
        <ChartProprietaryTemplate>

          <template v-slot:header>

            <a-collapse defaultActiveKey="1" :bordered="false">

              <a-collapse-panel header="外环文本" key="1">

                <div class="comment-template__item">
                  <p class="comment-template__leading">风格:</p>
                  <div class="comment-template__inner comment-template__end">
                    <a-radio-group
                      buttonStyle="solid"
                      v-model="config.proprietaryConfig.angleAxis.axisLabel.fontStyle"
                      @change="change">
                      <a-radio-button value="normal">正常</a-radio-button>
                      <a-radio-button value="italic">斜体</a-radio-button>
                    </a-radio-group>
                  </div>
                </div>
                <!-- / 风格 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.angleAxis.axisLabel.color"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 颜色 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">大小:</p>
                  <div class="comment-template__inner">
                    <a-slider
                      :min="6"
                      :max="24"
                      @change="change"
                      v-model="config.proprietaryConfig.angleAxis.axisLabel.fontSize" />
                  </div>
                </div>
                <!-- / 大小 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">粗细:</p>
                  <div class="comment-template__inner">
                    <a-select
                      v-model="config.proprietaryConfig.angleAxis.axisLabel.fontWeight"
                      @change="change">
                      <a-select-option value="normal">正常</a-select-option>
                      <a-select-option value="lighter">细</a-select-option>
                      <a-select-option value="bold">粗</a-select-option>
                      <a-select-option value="bolder">更粗</a-select-option>
                    </a-select>
                  </div>
                </div>
                <!-- / 粗细 -->

              </a-collapse-panel>
              <!-- / 外环文本 -->

              <a-collapse-panel header="刻度文本" key="2">

                <div class="comment-template__item">
                  <p class="comment-template__leading">风格:</p>
                  <div class="comment-template__inner comment-template__end">
                    <a-radio-group
                      buttonStyle="solid"
                      v-model="config.proprietaryConfig.radiusAxis.axisLabel.fontStyle"
                      @change="change">
                      <a-radio-button value="normal">正常</a-radio-button>
                      <a-radio-button value="italic">斜体</a-radio-button>
                    </a-radio-group>
                  </div>
                </div>
                <!-- / 风格 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.radiusAxis.axisLabel.color"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 颜色 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">大小:</p>
                  <div class="comment-template__inner">
                    <a-slider
                      :min="6"
                      :max="24"
                      @change="change"
                      v-model="config.proprietaryConfig.radiusAxis.axisLabel.fontSize" />
                  </div>
                </div>
                <!-- / 大小 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">粗细:</p>
                  <div class="comment-template__inner">
                    <a-select
                      v-model="config.proprietaryConfig.radiusAxis.axisLabel.fontWeight"
                      @change="change">
                      <a-select-option value="normal">正常</a-select-option>
                      <a-select-option value="lighter">细</a-select-option>
                      <a-select-option value="bold">粗</a-select-option>
                      <a-select-option value="bolder">更粗</a-select-option>
                    </a-select>
                  </div>
                </div>
                <!-- / 粗细 -->

              </a-collapse-panel>
              <!-- / 刻度文本 -->

              <a-collapse-panel header="刻度线" key="3">

                <div class="comment-template__item">
                  <p class="comment-template__leading">颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.radiusAxis.axisLine.lineStyle.color"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 颜色 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">宽度:</p>
                  <div class="comment-template__inner">
                    <a-slider
                      :min="1"
                      :max="16"
                      @change="change"
                      v-model="config.proprietaryConfig.radiusAxis.axisLine.lineStyle.width" />
                  </div>
                </div>
                <!-- / 颜色 -->

              </a-collapse-panel>
              <!-- / 分隔线 -->

              <a-collapse-panel header="分隔线" key="4">

                <div class="comment-template__item">
                  <p class="comment-template__leading">颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.radar.splitLine.lineStyle.color"
                      @change="splitColorChange"
                    />
                  </div>
                </div>
                <!-- / 颜色 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">分割数量:</p>
                  <div class="comment-template__inner">
                    <a-slider
                      :min="1"
                      :max="16"
                      @change="splitNumberChange"
                      v-model="config.proprietaryConfig.radar.splitNumber" />
                  </div>
                </div>
                <!-- / 颜色 -->

              </a-collapse-panel>
              <!-- / 分隔线 -->

              <a-collapse-panel header="半径" key="5">

                <div class="comment-template__item">
                  <p class="comment-template__leading">内半径:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="text"
                      @change="radiusChange"
                      v-model="config.proprietaryConfig.polar.radius.inside" />
                  </div>
                </div>
                <!-- / 内半径 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">外半径:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="text"
                      @change="radiusChange"
                      v-model="config.proprietaryConfig.polar.radius.outside" />
                  </div>
                </div>
                <!-- / 外半径 -->

              </a-collapse-panel>
              <!-- / 半径 -->

              <a-collapse-panel header="遮罩" key="6">

                <div class="comment-template__item">
                  <p class="comment-template__leading">显示:</p>
                  <div class="comment-template__inner comment-template__end">
                    <a-switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      v-model="config.proprietaryConfig.polarMask.show"
                      @change="change" />
                  </div>
                </div>
                <!-- / 显示 -->

                <div class="comment-template__item" v-if="config.proprietaryConfig.polarMask.show">
                  <p class="comment-template__leading">颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.polarMask.color"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 颜色 -->

              </a-collapse-panel>
              <!-- / 遮罩 -->

            </a-collapse>

          </template>

          <template>

            <a-collapse :bordered="false">

              <a-collapse-panel header="柱条颜色" key="1">

                <Color />

              </a-collapse-panel>
              <!-- / 颜色 -->

              <a-collapse-panel header="背景颜色" key="2">

                <div class="comment-template__item">
                  <p class="comment-template__leading">左侧中心:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.polarLinearColors.left.start"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 左侧中心 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">左侧扩散:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.polarLinearColors.left.end"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 左侧扩散 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">右侧中心:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.polarLinearColors.right.start"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 右侧中心 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">右侧扩散:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.polarLinearColors.right.end"
                      @change="change"
                    />
                  </div>
                </div>
                <!-- / 右侧扩散 -->

              </a-collapse-panel>
              <!-- / 背景颜色 -->

            </a-collapse>

          </template>
        </ChartProprietaryTemplate>
        <!-- E 专有配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="数据配置" key="3">

        <!-- S 数据配置模板 -->
        <PolarDataSource />
        <!-- E 数据配置模板 -->

      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common/index.vue'
import ChartProprietaryTemplate from '../chartProprietary'
import ProprietaryMixins from '../proprietaryMixins'
import PolarDataSource from '../dataSource/PolarDataSource'
import Color from '../common/Color'
import ColorPicker from '@/components/ColorPicker'

export default {
  name: 'Polar',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ChartProprietaryTemplate,
    PolarDataSource,
    ColorPicker,
    Color
  },
  data: () => ({}),
  methods: {
    /**
     * 分隔线颜色更新
     */
    splitColorChange () {
      const color = this.config.proprietaryConfig.radar.splitLine.lineStyle.color
      Object.assign(this.config.proprietaryConfig.radar.axisLine, {
        show: true,
        lineStyle: {
          color
        }
      })
      Object.assign(this.config.proprietaryConfig.radiusAxis.axisLine, {
        show: true,
        lineStyle: {
          color
        }
      })
      this.change()
    },
    /**
     * 分隔线数量更新
     */
    splitNumberChange () {
      const num = this.config.proprietaryConfig.radar.splitNumber
      Object.assign(this.config.proprietaryConfig.radar, {
        radiusAxis: {
          radiusAxis: {
            splitNumber: num
          }
        }
      })
      this.change()
    },
    /**
     * 半径更新
     */
    radiusChange () {
      const { inside, outside } = this.config.proprietaryConfig.polar.radius
      Object.assign(this.config.proprietaryConfig.radar, {
        radius: {
          inside,
          outside
        }
      })
      this.change()
    }
  }
}
</script>

<style scoped lang="less">
  .polar-config {
    height: calc(100% - 57px);

    &__colors {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      align-items: center;
      span {
        width: 22px;
        height: 22px;
      }
    }

    &__linear {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      align-items: center;
      span {
        width: 22px;
        height: 72px;
      }
    }
  }
</style>
