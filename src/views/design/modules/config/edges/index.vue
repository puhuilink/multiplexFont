/**
* 边通用配置模板
* Author: dong xing
* Date: 2020/2/20
* Time: 11:34 上午
* Email: dong.xing@outlook.com
*/
<template>
  <div class="common-edge-template common-template">

    <a-collapse defaultActiveKey="1" :bordered="false">

      <!-- S 节点 -->
      <a-collapse-panel header="边" key="1">

        <EdgeTemplate :model="model" @change="change" ref="edgeTemplate">

          <template v-slot:header="{ model }">

            <div class="comment-template__item">
              <p class="comment-template__leading">连线形状:</p>
              <div class="comment-template__inner topology-config__editable">
                <a-radio-group
                  buttonStyle="solid"
                  v-model="model.shape"
                  @change="change()">
                  <a-radio-button value="line">直线</a-radio-button>
                  <a-radio-button value="polyline">折线</a-radio-button>
                  <a-radio-button value="cubic">弧线</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <!-- / 连线形状 -->

            <div class="comment-template__item">
              <p class="comment-template__leading">默认动画:</p>
              <div class="comment-template__inner comment-template__end">
                <a-tooltip title="切换动画方向" v-show="model.animate">
                  <a-button type="link" icon="swap" @click="animationDirectionChange"></a-button>
                </a-tooltip>
                <a-switch
                  checkedChildren="启用"
                  unCheckedChildren="不启用"
                  v-model="model.animate"
                  @change="animateChange" />
              </div>
            </div>
            <!-- / 默认动画 -->

          </template>

          <template v-slot="{ model }">
            <div class="comment-template__item">
              <p class="comment-template__leading">文本:</p>
              <div class="comment-template__inner">
                <a-input
                  type="text"
                  v-model.trim="model.label"
                  @change="change" />
              </div>
            </div>
            <!-- / 文本 -->

            <div class="comment-template__item">
              <p class="comment-template__leading">文本颜色:</p>
              <div class="comment-template__inner">
                <ColorPicker v-model="model.labelCfg.style.fill" @change="change" />
              </div>
            </div>
            <!-- / 文本颜色 -->

            <div class="comment-template__item">
              <p class="comment-template__leading">文本大小:</p>
              <div class="comment-template__inner">
                <a-input
                  type="number"
                  v-model.number="model.labelCfg.style.fontSize"
                  min="0"
                  @change="change" />
              </div>
            </div>
            <!-- / 文本大小 -->

            <div class="comment-template__item">
              <p class="comment-template__leading">文本位置:</p>
              <div class="comment-template__inner">
                <a-select
                  v-model="model.labelCfg.position"
                  @change="change">
                  <a-select-option value="middle">居中</a-select-option>
                  <a-select-option value="start">居上</a-select-option>
                  <a-select-option value="end">居下</a-select-option>
                  <a-select-option value="left">居右</a-select-option>
                  <a-select-option value="right">居左</a-select-option>
                </a-select>
              </div>
            </div>
            <!-- / 文本位置 -->

          </template>

        </EdgeTemplate>

      </a-collapse-panel>
      <!-- / 节点 -->

    </a-collapse>

  </div>
</template>

<script>
import '@/assets/less/template.less'
import _ from 'lodash'
import { mapMutations, mapState } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import EdgeTemplate from './edge'
import ColorPicker from '@/components/ColorPicker'
import Template from '../../template/index'

export default {
  name: 'CommonEdgeTemplate',
  components: {
    Template,
    EdgeTemplate,
    ColorPicker
  },
  computed: {
    ...mapState('screen', ['activeWidget', 'activeEdge']),
    model () {
      return _.cloneDeep(this.activeEdge.getModel())
    }
  },
  methods: {
    ...mapMutations('screen', {
      updateEdge: ScreenMutations.ACTIVATE_EDGE,
      updateTopologyConfig: ScreenMutations.UPDATE_TOPOLOGY_CONFIG
    }),
    change () {
      const { render } = this.activeWidget
      // 根据配置更新视图
      render.chart.updateItem(
        this.model.id,
        // shape为polyline时controlPoints会自动生成与计算
        _.omit(this.model, this.model.shape === 'polyline' ? ['controlPoints'] : [])
      )
      // 更新边配置
      this.updateEdge({
        activeEdge: render.chart.find('edge', edge => edge.getModel().id === this.model.id)
      })
      // 更新配置
      this.updateTopologyConfig()
    },
    /**
     * 动画启用更新
     */
    animateChange () {
      const { render: { chart } } = this.activeWidget
      chart.setItemState(this.model.id, 'active', this.model.animate)
      this.change()
    },
    /**
     * 切换动画方向
     */
    animationDirectionChange () {
      const { source, target } = this.model
      // FIXME: shape 为 polyline 时更改动画方向连线形状也跟着改变
      Object.assign(this.model, {
        source: target,
        target: source
      })
      this.change()
    }
  }
}
</script>

<style scoped>

</style>
