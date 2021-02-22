/**
* 柱形图配置
* Author: dong xing
* Date: 2019/11/13
* Time: 2:59 下午
* Email: dong.xing@outlook.com
*/

<template>
  <div class="bar-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="样式" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">

        <!-- S 专有配置模板 -->
        <ChartProprietaryTemplate show-x-axis show-y-axis>

          <template v-slot:header>

            <a-collapse :activeKey="[1, 2]" :bordered="false">

              <a-collapse-panel header="图形" key="1">

                <div class="comment-template__item">
                  <p class="comment-template__leading">柱条方向:</p>
                  <div class="comment-template__inner">
                    <div class="comment-template__inner comment-template__end">
                      <a-radio-group
                        buttonStyle="solid"
                        v-model="config.proprietaryConfig.reverse"
                        @change="change">
                        <a-radio-button :value="true">横向</a-radio-button>
                        <a-radio-button :value="false">纵向</a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>
                </div>
                <!-- / 反转 x / y 轴 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">显示类型:</p>
                  <div class="comment-template__inner">
                    <a-select
                      v-model="config.proprietaryConfig.barType"
                      @change="change">
                      <a-select-option value="single">单列</a-select-option>
                      <a-select-option value="multiple">多列</a-select-option>
                    </a-select>
                  </div>
                </div>
                <!-- / 数据类型 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">柱条宽度:</p>
                  <div class="comment-template__inner">
                    <a-select
                      v-model="config.proprietaryConfig.barWidthType"
                      @change="barWidthTypeChange(config)">
                      <a-select-option value="auto">自适应</a-select-option>
                      <a-select-option value="custom">自定义</a-select-option>
                    </a-select>
                  </div>
                </div>
                <!-- / 柱条宽度 -->

                <div
                  class="comment-template__item"
                  v-if="config.proprietaryConfig.barWidthType === 'custom'"
                >
                  <p class="comment-template__leading">自定宽度:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      min="12"
                      max="100"
                      @change="change"
                      v-model.number="config.proprietaryConfig.barWidth" />
                  </div>
                </div>
                <!-- / 柱条宽度 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">小数位数:</p>
                  <div class="comment-template__inner">
                    <a-slider
                      v-model="config.proprietaryConfig.decimalPoint"
                      @change="change()"
                      :min="-1"
                      :max="4" />
                  </div>
                </div>
                <!-- / 小数点保留 -->

              </a-collapse-panel>
              <!-- / 图形 -->

            </a-collapse>

          </template>

          <template>

            <a-collapse :bordered="false">

              <a-collapse-panel header="柱条颜色" key="1">

                <Color />

              </a-collapse-panel>
              <!-- / 颜色 -->

              <a-collapse-panel header="柱条圆角" key="2">

                <div class="comment-template__item">
                  <p class="comment-template__leading">左上:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      min="0"
                      max="100"
                      @change="change"
                      v-model.number="config.proprietaryConfig.barItemStyle.barBorderRadius[0]" />
                  </div>
                </div>
                <!-- / 左上圆角 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">右上:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      min="0"
                      max="100"
                      @change="change"
                      v-model.number="config.proprietaryConfig.barItemStyle.barBorderRadius[1]" />
                  </div>
                </div>
                <!-- / 左上圆角 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">右下:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      min="0"
                      max="100"
                      @change="change"
                      v-model.number="config.proprietaryConfig.barItemStyle.barBorderRadius[2]" />
                  </div>
                </div>
                <!-- / 左上圆角 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">左下:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      min="0"
                      max="100"
                      @change="change"
                      v-model.number="config.proprietaryConfig.barItemStyle.barBorderRadius[3]" />
                  </div>
                </div>
                <!-- / 左上圆角 -->

              </a-collapse-panel>
              <!-- / 圆角 -->

            </a-collapse>

          </template>
        </ChartProprietaryTemplate>
        <!-- E 专有配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="数据" key="3">

        <!-- S 数据配置模板 -->
        <BarDataSource />
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
import BarDataSource from '../dataSource/BarDataSource'
import Color from '../common/Color'

export default {
  name: 'Bar',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ChartProprietaryTemplate,
    BarDataSource,
    Color
  },
  data: () => ({}),
  methods: {
    /**
       * 柱条宽度类型更改
       * @param config 配置
       */
    barWidthTypeChange (config) {
      Object.assign(config.proprietaryConfig, {
        barWidth: config.proprietaryConfig.barWidthType === 'custom'
          ? 12
          : 'auto'
      })
      this.change(config)
    }
  }
}
</script>

<style scoped lang="less">
  .bar-config {
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
