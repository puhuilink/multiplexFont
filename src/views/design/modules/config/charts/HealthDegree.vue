/*
 * 健康度配置
 */
<template>
  <div class="comment-template">
    <div class="comment-template__header">
      <p class="comment-template__name">健康度</p>
      <a-popconfirm
        title="从视图中删除该部件?"
        placement="left"
        @confirm="() => removeWidget({ widgetId: activeWidget.widgetId })"
        okText="确定"
        cancelText="取消"
      >
        <a-button shape="circle" type="danger" icon="delete" />
      </a-popconfirm>
    </div>
    <div class="lines-config">
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
          <div class="texts-config__template chart-proprietary-template">
            <a-collapse defaultActiveKey="1" :bordered="false">

              <!-- S 数值设置 -->
              <a-collapse-panel header="数值设置" key="1">

                <div class="comment-template__item">
                  <p class="comment-template__leading">字体大小:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      v-model="config.proprietaryConfig.title.textStyle.fontSize"
                      @change="change()"
                    />
                  </div>
                </div>
                <!-- / 字体大小 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">字体颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.title.textStyle.color"
                      @change="change()" />
                  </div>
                </div>
                <!-- / 字体颜色 -->

                <div class="comment-template__item">
                  <p class="comment-template__leading">小数点:</p>
                  <div class="comment-template__inner">
                    <a-slider
                      v-model="titleUnit"
                      @change="titleUnitChange"
                      :min="1"
                      :max="10" />
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
              <!-- E 数值设置 -->

              <!-- S 内圆(健康环) -->
              <a-collapse-panel header="内圆设置" key="2">
                <div class="comment-template__item">
                  <p class="comment-template__leading">浅颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.innerCircle.color.start"
                      @change="change()" />
                  </div>
                </div>
                <div class="comment-template__item">
                  <p class="comment-template__leading">深颜色:</p>
                  <div class="comment-template__inner">
                    <ColorPicker
                      v-model="config.proprietaryConfig.innerCircle.color.end"
                      @change="change()" />
                  </div>
                </div>

                <div class="comment-template__item">
                  <p class="comment-template__leading">半径:</p>
                  <div class="comment-template__inner">
                    <a-input
                      type="number"
                      v-model="config.proprietaryConfig.innerCircle.radius"
                      @change="change()"
                    />
                  </div>
                </div>
              </a-collapse-panel>
              <!-- E 内圆 -->

              <!-- S 刻度设置 -->
              <a-collapse-panel header="刻度设置" key="3">
                <div class="comment-template__item">
                  <p class="comment-template__leading">显示:</p>
                  <div class="comment-template__inner comment-template__end">
                    <a-switch
                      checkedChildren="显示"
                      unCheckedChildren="不显示"
                      v-model="config.proprietaryConfig.scale.show"
                      @change="change()" />
                  </div>
                </div>
                <!-- / 显示 -->
                <div v-if="config.proprietaryConfig.scale.show">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">类型:</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-radio-group
                        buttonStyle="solid"
                        v-model="config.proprietaryConfig.scale.type"
                        @change="scaleTypeChange(config)">
                        <a-radio-button value="dotted">虚线</a-radio-button>
                        <a-radio-button value="solid">实线</a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>
                  <!-- / 类型 -->

                  <div class="comment-template__item">
                    <p class="comment-template__leading">颜色:</p>
                    <div class="comment-template__inner">
                      <ColorPicker
                        v-model="config.proprietaryConfig.scale.color"
                        @change="change()"/>
                    </div>
                  </div>
                  <!-- / 颜色 -->

                  <div class="comment-template__item">
                    <p class="comment-template__leading">半径:</p>
                    <div class="comment-template__inner">
                      <a-input
                        type="number"
                        v-model="config.proprietaryConfig.scale.radius"
                        @change="change()"
                      />
                    </div>
                  </div>
                  <!-- / 宽度 -->
                </div>
              </a-collapse-panel>
              <!-- E 刻度设置 -->
            </a-collapse>
          </div>
        </a-tab-pane>

        <a-tab-pane tab="数据配置" key="3">

          <!-- S 数据配置模板 -->
          <DataSourceTemplate />
          <!-- E 数据配置模板 -->

        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import CommonTemplate from '../common'
import ColorPicker from '@/components/ColorPicker'
import LinearColorPicker from '@/components/LinearColorPicker'
import DataSourceTemplate from '../dataSource'

export default {
  name: 'HealthDegree',
  components: {
    CommonTemplate,
    ColorPicker,
    DataSourceTemplate,
    LinearColorPicker
  },
  data: () => ({
    titleUnit: 0,
    zone: '40-60;60-80;80-100',
    zoneColor: 'rgba(86,198,62,1)-rgba(40,131,38,1);rgba(249,197,87,1)-rgba(207,87,27,1);rgba(227,35,30,1)-rgba(158,24,13,1) '
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET,
      removeWidget: ScreenMutations.REMOVE_WIDGET
    }),
    /**
     * 小数点位数改变
     */
    titleUnitChange (e) {
      const titleNum = this.config.proprietaryConfig.title.text
      const textChange = this.fomatFloat(titleNum, e)
      this.config.proprietaryConfig.title.text = textChange
      this.change()
    },
    /**
     * 小数点取值操作
     * 保留n位小数并格式化输出（不足的部分补0）
     */
    fomatFloat (value, n) {
      var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        s += '.'
      }
      for (var i = s.length - s.indexOf('.'); i <= n; i++) {
        s += '0'
      }
      return s
    },
    scaleTypeChange (config) {
      const dottedScale = {
        id: 'SeriesGauge',
        type: 'gauge',
        radius: '100',
        startAngle: 225,
        endAngle: -134.8,
        z: 4,
        axisTick: {
          show: true,
          lineStyle: {
            width: 2,
            color: 'rgba(1,244,255, 0.9)'
          }
        },
        splitLine: {
          length: 16,
          lineStyle: {
            width: 2,
            color: 'rgba(1,244,255, 0.9)'
          }
        },
        axisLabel: {
          color: 'rgba(255,255,255,0)',
          fontSize: 12
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            opacity: 0
          }
        },
        detail: {
          show: false
        },
        data: [100]
      }
      const solidScale = {
        type: 'pie',
        radius: 80,
        center: ['50%', '50%'],
        z: 5,
        silent: true,
        labelLine: false,
        color: {
          start: 'red',
          end: 'orange',
          type: 'linear',
          colorStops: [{
            offset: 0,
            color: 'rgba(86,198,62,1)'
          }, {
            offset: 1,
            color: 'rgba(40,131,38,1)'
          }]
        },
        data: [100]
      }
      const content = config.proprietaryConfig.scale.type === 'dotted'
        ? dottedScale
        : solidScale
      Object.assign(config.proprietaryConfig.scale, {
        content
      })
      this.change()
    },
    change () {
      const activeWidget = _.cloneDeep(this.activeWidget)
      const { render } = this.activeWidget
      Object.assign(activeWidget.config, this.config)
      this.activateWidget({
        widget: Object.assign(activeWidget, { render })
      })
      this.$nextTick(() => {
        render.mergeOption(this.config)
      })
    }
  }
}
</script>

<style scoped>
  .chart-proprietary-template {
    height: calc(100vh - 224px);
    overflow: auto;
  }
</style>
