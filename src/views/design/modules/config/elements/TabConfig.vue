<template>
  <div class="alarm-list-config">
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
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">
            <div class="chart-proprietary-template">

              <!-- S 图表专有配置顶部插槽 -->
              <a-collapse :activeKey="[1, 2]" :bordered="false">

                <a-collapse-panel header="图形" key="1">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">柱条方向:</p>
                    <div class="comment-template__inner">
                      <div class="comment-template__inner comment-template__end">
                        <a-radio-group
                          buttonStyle="solid"
                          v-model="config.proprietaryConfig.props.styleConfig.reverse"
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
                        v-model="config.proprietaryConfig.props.styleConfig.barType"
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
                        v-model="config.proprietaryConfig.props.styleConfig.barWidthType"
                        @change="barWidthTypeChange(config)">
                        <a-select-option value="auto">自适应</a-select-option>
                        <a-select-option value="custom">自定义</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <!-- / 柱条宽度 -->

                  <div
                    class="comment-template__item"
                    v-if="config.proprietaryConfig.props.styleConfig.barWidthType === 'custom'"
                  >
                    <p class="comment-template__leading">自定宽度:</p>
                    <div class="comment-template__inner">
                      <a-input
                        type="number"
                        min="12"
                        max="100"
                        @change="change"
                        v-model.number="config.proprietaryConfig.props.styleConfig.barWidth" />
                    </div>
                  </div>
                  <!-- / 柱条宽度 -->

                  <div class="comment-template__item">
                    <p class="comment-template__leading">小数位数:</p>
                    <div class="comment-template__inner">
                      <a-slider
                        v-model="config.proprietaryConfig.props.styleConfig.decimalPoint"
                        @change="change()"
                        :min="-1"
                        :max="4" />
                    </div>
                  </div>
                  <!-- / 小数点保留 -->

                </a-collapse-panel>
                <!-- / 图形 -->

              </a-collapse>
              <!-- E 图表专有配置顶部插槽 -->

              <!-- E 折线图专有配置 -->
              <a-collapse :bordered="false">

                <a-collapse-panel header="图例" key="1">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">显示:</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-switch
                        checkedChildren="显示"
                        unCheckedChildren="不显示"
                        v-model="config.proprietaryConfig.props.styleConfig.legend.show"
                        @change="change" />
                    </div>
                  </div>
                  <!-- / 显示 -->

                  <div class="comment-template__item" v-show="config.proprietaryConfig.props.styleConfig.legend.show">
                    <p class="comment-template__leading">类型:</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-select v-model="config.proprietaryConfig.props.styleConfig.legend.type" @change="change">
                        <a-select-option value="plain">默认</a-select-option>
                        <a-select-option value="scroll">滚动</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <!-- / 类型 -->

                  <div v-show="config.proprietaryConfig.props.styleConfig.legend.show">
                    <div class="comment-template__item">
                      <p class="comment-template__leading">方向:</p>
                      <div class="comment-template__inner">
                        <a-select
                          v-model="config.proprietaryConfig.props.styleConfig.legend.orient"
                          @change="change">
                          <a-select-option value="horizontal">水平</a-select-option>
                          <a-select-option value="vertical">纵向</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <!-- / 方向 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">居上:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="text"
                          @change="change"
                          v-model="config.proprietaryConfig.props.styleConfig.legend.top" />
                      </div>
                    </div>
                    <!-- / 居上 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">居右:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="text"
                          @change="change"
                          v-model="config.proprietaryConfig.props.styleConfig.legend.right" />
                      </div>
                    </div>
                    <!-- / 居右 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">居下:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="text"
                          @change="change"
                          v-model="config.proprietaryConfig.props.styleConfig.legend.bottom" />
                      </div>
                    </div>
                    <!-- / 居下 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">居左:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="text"
                          @change="change"
                          v-model="config.proprietaryConfig.props.styleConfig.legend.left" />
                      </div>
                    </div>
                    <!-- / 居左 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">图标:</p>
                      <div class="comment-template__inner">
                        <a-select
                          v-model="config.proprietaryConfig.props.styleConfig.legend.icon"
                          @change="change">
                          <a-select-option
                            v-for="(icon, index) in icons"
                            :key="index"
                            :value="icon.value">
                            {{ icon.name }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <!-- / 方向 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">颜色:</p>
                      <div class="comment-template__inner">
                        <ColorPicker
                          v-model="config.proprietaryConfig.props.styleConfig.legend.textStyle.color"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 文字颜色 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">粗细:</p>
                      <div class="comment-template__inner">
                        <a-select
                          v-model="config.proprietaryConfig.props.styleConfig.legend.textStyle.fontWeight"
                          @change="change">
                          <a-select-option value="normal">正常</a-select-option>
                          <a-select-option value="lighter">细</a-select-option>
                          <a-select-option value="bold">粗</a-select-option>
                          <a-select-option value="bolder">更粗</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <!-- / 文字粗细 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">大小:</p>
                      <div class="comment-template__inner">
                        <a-slider
                          :min="6"
                          :max="24"
                          @change="change"
                          v-model="config.proprietaryConfig.props.styleConfig.legend.textStyle.fontSize" />
                      </div>
                    </div>
                  </div>
                  <!-- / 文字大小 -->

                </a-collapse-panel>
                <!-- / 图例 -->

                <a-collapse-panel header="X坐标轴" key="2">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">显示:</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-switch
                        checkedChildren="显示"
                        unCheckedChildren="不显示"
                        v-model="config.proprietaryConfig.props.styleConfig.xAxis.show"
                        @change="change" />
                    </div>
                  </div>
                  <!-- / 显示 -->

                  <div v-if="config.proprietaryConfig.props.styleConfig.xAxis.show">
                    <div class="comment-template__item">
                      <p class="comment-template__leading">位置:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-radio-group
                          buttonStyle="solid"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.position"
                          @change="change">
                          <a-radio-button value="top">居上</a-radio-button>
                          <a-radio-button value="bottom">居下</a-radio-button>
                        </a-radio-group>
                      </div>
                    </div>
                    <!-- / 位置 -->
                    <!-- / FIXME: x / y 轴其一更改方向异常 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">数据类型:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-radio-group
                          buttonStyle="solid"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.type"
                          @change="change">
                          <a-radio-button value="category">类目</a-radio-button>
                          <a-radio-button value="value">数值</a-radio-button>
                          <a-radio-button value="time">时间</a-radio-button>
                        </a-radio-group>
                      </div>
                    </div>
                    <!-- / 数据类型 -->

                    <div class="comment-template__item" v-show="config.proprietaryConfig.props.styleConfig.xAxis.type === 'category'">
                      <p class="comment-template__leading">数轴留白:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="留白"
                          unCheckedChildren="不留白"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.boundaryGap"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 数轴留白 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">显示名称:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.showName"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 显示名称 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.xAxis.showName">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">名称:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="text"
                            @change="change"
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.name" />
                        </div>
                      </div>
                      <!-- / 名称 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">名称位置:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.nameLocation"
                            @change="change">
                            <a-select-option value="start">前</a-select-option>
                            <a-select-option value="center">中</a-select-option>
                            <a-select-option value="end">后</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 名称位置 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">名称颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.nameTextStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 名称颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">名称大小:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="number"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.nameTextStyle.fontSize" />
                        </div>
                      </div>
                      <!-- / 名称大小 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">名称粗细:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.nameTextStyle.fontWeight"
                            @change="change">
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="lighter">细</a-select-option>
                            <a-select-option value="bold">粗</a-select-option>
                            <a-select-option value="bolder">更粗</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 名称粗细 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">名称风格:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.nameTextStyle.fontStyle"
                            @change="change">
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="italic">斜体</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 名称风格 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">间距:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="number"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.nameGap" />
                        </div>
                      </div>
                      <!-- / 间距 -->

                    </div>
                    <!-- / 名称 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">坐标轴线:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLine.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 坐标轴线 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.xAxis.axisLine.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">轴线颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLine.lineStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 轴线颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">轴线宽度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="0"
                            :max="16"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.axisLine.lineStyle.width" />
                        </div>
                      </div>
                      <!-- / 轴线宽度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">轴线类型:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLine.lineStyle.type"
                            @change="change">
                            <a-select-option value="solid">直线</a-select-option>
                            <a-select-option value="dashed">虚线</a-select-option>
                            <a-select-option value="dotted">点线</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 轴线类型 -->

                    </div>
                    <!-- / 坐标轴线设置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">坐标刻度:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisTick.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 坐标刻度 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.xAxis.axisTick.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisTick.lineStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 刻度颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度长度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="0"
                            :max="16"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.axisTick.length" />
                        </div>
                      </div>
                      <!-- / 刻度长度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度宽度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="0"
                            :max="16"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.axisTick.lineStyle.width" />
                        </div>
                      </div>
                      <!-- / 刻度宽度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度类型:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisTick.lineStyle.type"
                            @change="change">
                            <a-select-option value="solid">直线</a-select-option>
                            <a-select-option value="dashed">虚线</a-select-option>
                            <a-select-option value="dotted">点线</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 轴线类型 -->

                    </div>
                    <!-- / 坐标刻度设置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">坐标标签:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 坐标标签 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签角度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="-90"
                            :max="90"
                            @change="change"
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.rotate" />
                        </div>
                      </div>
                      <!-- / 标签角度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签间距:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="number"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.margin" />
                        </div>
                      </div>
                      <!-- / 标签间距 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 刻度颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签大小:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="6"
                            :max="32"
                            @change="change"
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.fontSize" />
                        </div>
                      </div>
                      <!-- / 标签大小 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签粗细:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.fontWeight"
                            @change="change">
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="lighter">细</a-select-option>
                            <a-select-option value="bold">粗</a-select-option>
                            <a-select-option value="bolder">更粗</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 标签粗细 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签风格:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.axisLabel.fontStyle"
                            @change="change">
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="italic">斜体</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 标签风格 -->

                    </div>
                    <!-- / 坐标刻度设置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">分隔线:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.xAxis.splitLine.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 分隔线 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.xAxis.splitLine.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">隔线颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.splitLine.lineStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 隔线颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">隔线宽度:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="number"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.xAxis.splitLine.lineStyle.width" />
                        </div>
                      </div>
                      <!-- / 隔线宽度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">隔线类型:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.xAxis.splitLine.lineStyle.type"
                            @change="change">
                            <a-select-option value="solid">直线</a-select-option>
                            <a-select-option value="dashed">虚线</a-select-option>
                            <a-select-option value="dotted">点线</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 轴线类型 -->

                    </div>
                    <!-- / 分隔线设置 -->

                  </div>

                </a-collapse-panel>
                <!-- / X坐标轴 -->

                <a-collapse-panel header="Y坐标轴" key="3">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">显示:</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-switch
                        checkedChildren="显示"
                        unCheckedChildren="不显示"
                        v-model="config.proprietaryConfig.props.styleConfig.yAxis.show"
                        @change="change" />
                    </div>
                  </div>
                  <!-- / 显示 -->

                  <div v-if="config.proprietaryConfig.props.styleConfig.yAxis.show">
                    <div class="comment-template__item">
                      <p class="comment-template__leading">位置:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-radio-group
                          buttonStyle="solid"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.position"
                          @change="change">
                          <a-radio-button value="left">居左</a-radio-button>
                          <a-radio-button value="right">居右</a-radio-button>
                        </a-radio-group>
                      </div>
                    </div>
                    <!-- / 位置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">数据类型:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-radio-group
                          buttonStyle="solid"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.type"
                          @change="change">
                          <a-radio-button value="category">类别</a-radio-button>
                          <a-radio-button value="value">数值</a-radio-button>
                          <a-radio-button value="time">时间</a-radio-button>
                        </a-radio-group>
                      </div>
                    </div>
                    <!-- / 数据类型 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">名称:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="text"
                          @change="change"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.name" />
                      </div>
                    </div>
                    <!-- / 名称 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">名称位置:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-select
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.nameLocation"
                          @change="change">
                          <a-select-option value="end">上</a-select-option>
                          <a-select-option value="center">中</a-select-option>
                          <a-select-option value="start">下</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <!-- / 名称位置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">名称颜色:</p>
                      <div class="comment-template__inner comment-template__end">
                        <ColorPicker
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.nameTextStyle.color"
                          @change="change()"/>
                      </div>
                    </div>
                    <!-- / 名称颜色 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">名称大小:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="number"
                          @change="change"
                          v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.nameTextStyle.fontSize" />
                      </div>
                    </div>
                    <!-- / 名称大小 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">名称粗细:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-select
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.nameTextStyle.fontWeight"
                          @change="change">
                          <a-select-option value="normal">正常</a-select-option>
                          <a-select-option value="lighter">细</a-select-option>
                          <a-select-option value="bold">粗</a-select-option>
                          <a-select-option value="bolder">更粗</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <!-- / 名称粗细 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">名称风格:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-select
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.nameTextStyle.fontStyle"
                          @change="change">
                          <a-select-option value="normal">正常</a-select-option>
                          <a-select-option value="italic">斜体</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <!-- / 名称风格 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">间距:</p>
                      <div class="comment-template__inner">
                        <a-input
                          type="number"
                          @change="change"
                          v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.nameGap" />
                      </div>
                    </div>
                    <!-- / 间距 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">坐标轴线:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLine.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 坐标轴线 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.yAxis.axisLine.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">轴线颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLine.lineStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 轴线颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">轴线宽度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="0"
                            :max="16"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.axisLine.lineStyle.width" />
                        </div>
                      </div>
                      <!-- / 轴线宽度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">轴线类型:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLine.lineStyle.type"
                            @change="change">
                            <a-select-option value="solid">直线</a-select-option>
                            <a-select-option value="dashed">虚线</a-select-option>
                            <a-select-option value="dotted">点线</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 轴线类型 -->

                    </div>
                    <!-- / 坐标轴线设置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">坐标刻度:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisTick.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 坐标刻度 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.yAxis.axisTick.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisTick.lineStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 刻度颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度长度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="0"
                            :max="16"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.axisTick.length" />
                        </div>
                      </div>
                      <!-- / 刻度长度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度宽度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="0"
                            :max="16"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.axisTick.lineStyle.width" />
                        </div>
                      </div>
                      <!-- / 刻度长度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">刻度类型:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisTick.lineStyle.type"
                            @change="change">
                            <a-select-option value="solid">直线</a-select-option>
                            <a-select-option value="dashed">虚线</a-select-option>
                            <a-select-option value="dotted">点线</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 轴线类型 -->

                    </div>
                    <!-- / 坐标刻度设置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">坐标标签:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 坐标标签 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签角度:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="-90"
                            :max="90"
                            @change="change"
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.rotate" />
                        </div>
                      </div>
                      <!-- / 标签角度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签间距:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="number"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.margin" />
                        </div>
                      </div>
                      <!-- / 标签间距 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 刻度颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签大小:</p>
                        <div class="comment-template__inner">
                          <a-slider
                            :min="6"
                            :max="32"
                            @change="change"
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.fontSize" />
                        </div>
                      </div>
                      <!-- / 标签大小 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签粗细:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.fontWeight"
                            @change="change">
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="lighter">细</a-select-option>
                            <a-select-option value="bold">粗</a-select-option>
                            <a-select-option value="bolder">更粗</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 标签粗细 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">标签风格:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.axisLabel.fontStyle"
                            @change="change">
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="italic">斜体</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 标签风格 -->

                    </div>
                    <!-- / 坐标刻度设置 -->

                    <div class="comment-template__item">
                      <p class="comment-template__leading">分隔线:</p>
                      <div class="comment-template__inner comment-template__end">
                        <a-switch
                          checkedChildren="显示"
                          unCheckedChildren="不显示"
                          v-model="config.proprietaryConfig.props.styleConfig.yAxis.splitLine.show"
                          @change="change" />
                      </div>
                    </div>
                    <!-- / 分隔线 -->

                    <div v-if="config.proprietaryConfig.props.styleConfig.yAxis.splitLine.show">
                      <div class="comment-template__item">
                        <p class="comment-template__leading">隔线颜色:</p>
                        <div class="comment-template__inner comment-template__end">
                          <ColorPicker
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.splitLine.lineStyle.color"
                            @change="change()"/>
                        </div>
                      </div>
                      <!-- / 隔线颜色 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">隔线宽度:</p>
                        <div class="comment-template__inner">
                          <a-input
                            type="number"
                            @change="change"
                            v-model.number="config.proprietaryConfig.props.styleConfig.yAxis.splitLine.lineStyle.width" />
                        </div>
                      </div>
                      <!-- / 隔线宽度 -->

                      <div class="comment-template__item">
                        <p class="comment-template__leading">隔线类型:</p>
                        <div class="comment-template__inner comment-template__end">
                          <a-select
                            v-model="config.proprietaryConfig.props.styleConfig.yAxis.splitLine.lineStyle.type"
                            @change="change">
                            <a-select-option value="solid">直线</a-select-option>
                            <a-select-option value="dashed">虚线</a-select-option>
                            <a-select-option value="dotted">点线</a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <!-- / 轴线类型 -->

                    </div>
                    <!-- / 分隔线设置 -->

                  </div>

                </a-collapse-panel>
                <!-- / Y坐标轴 -->

              </a-collapse>
              <!-- E 折线图专有配置 -->

              <!-- S 图表专有配置默认插槽 -->
              <template>

                <a-collapse :bordered="false">

                  <a-collapse-panel header="柱条颜色" key="1">

                    <TabColor />

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
                          v-model.number="config.proprietaryConfig.props.styleConfig.barItemStyle.barBorderRadius[0]" />
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
                          v-model.number="config.proprietaryConfig.props.styleConfig.barItemStyle.barBorderRadius[1]" />
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
                          v-model.number="config.proprietaryConfig.props.styleConfig.barItemStyle.barBorderRadius[2]" />
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
                          v-model.number="config.proprietaryConfig.props.styleConfig.barItemStyle.barBorderRadius[3]" />
                      </div>
                    </div>
                    <!-- / 左上圆角 -->

                  </a-collapse-panel>
                  <!-- / 圆角 -->

                </a-collapse>

              </template>
              <!-- E 图表专有配置默认插槽 -->

            </div>
          </a-collapse>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="数据" key="3">
        <MoreDataSource />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import ProprietaryMixins from '@/views/design/modules/config/proprietaryMixins/index'
import CommonTemplate from '../common/index'
import ColorPicker from '~~~/ColorPicker'
import MoreDataSource from '../dataSource/MoreDataSource'
import ChartProprietaryTemplate from '@/views/design/modules/config/chartProprietary'
import TabColor from '@/views/design/modules/config/common/TabColor'
export default {
  name: 'TabConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate,
    ColorPicker,
    MoreDataSource,
    ChartProprietaryTemplate,
    TabColor
  },
  methods: {
    barWidthTypeChange (config) {
      Object.assign(config.proprietaryConfig.props.styleConfig, {
        barWidth: config.proprietaryConfig.props.styleConfig.barWidthType === 'custom'
          ? 12
          : 'auto'
      })
      this.change(config)
    }
  },
  data: () => ({
    icons: [
      { name: '圆点', value: 'circle' },
      { name: '矩形', value: 'rect' },
      { name: '圆角矩形', value: 'roundRect' },
      { name: '三角形', value: 'triangle' },
      { name: '菱形', value: 'diamond' }
    ],
    showXAxis: false,
    showYAxis: false
  })
}
</script>

<style scoped>

</style>
