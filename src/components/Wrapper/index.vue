/**
* 部件选择器
* Author: dong xing
* Date: 2019/11/13
* Time: 5:27 下午
* Email: dong.xing@outlook.com
*/
<template>
  <div id="wrapper" class="wrapper" ref="wrapper">
    <div class="wrapper__mask" ref="mask"></div>
    <div class="wrapper__handler wrapper__handler--tl" ref="tl"></div>
    <div class="wrapper__handler wrapper__handler--tc" ref="tc"></div>
    <div class="wrapper__handler wrapper__handler--tr" ref="tr"></div>
    <div class="wrapper__handler wrapper__handler--cr" ref="cr"></div>
    <div class="wrapper__handler wrapper__handler--br" ref="br"></div>
    <div class="wrapper__handler wrapper__handler--bc" ref="bc"></div>
    <div class="wrapper__handler wrapper__handler--bl" ref="bl"></div>
    <div class="wrapper__handler wrapper__handler--cl" ref="cl"></div>
    <div class="wrapper__move" ref="move">
      <a-dropdown :trigger="['contextmenu']">
        <div
          :style="{
            height: '100%'
          }"
        >
        </div>
        <a-menu slot="overlay" class="wrapper__menu">
          <a-menu-item key="1" class="wrapper__menu--primary" @click="copyWidget">
            <a-icon type="copy"/>
            复制部件
          </a-menu-item>
          <a-menu-item key="2" class="wrapper__menu--primary" @click="copyConfig">
            <a-icon type="snippets"/>
            复制配置
          </a-menu-item>
          <a-menu-item key="3" :disabled="!isAllowAsync" :class="[isAllowAsync ? 'wrapper__menu--primary': '']"
                       @click="syncConfig">
            <a-icon type="sync"/>
            同步配置
          </a-menu-item>
          <a-menu-item key="4" class="wrapper__menu--danger" @click="deleteWidget">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="5">
            <a-icon type="close"/>
            取消
          </a-menu-item>
          <a-menu-item key="6" class="wrapper__menu--up" @click="upzIndexWidget">
            <a-icon type="arrow-up"/>
            置于顶层
          </a-menu-item>
          <a-menu-item key="7" class="wrapper__menu--down" @click="downzIndexWidget">
            <a-icon type="arrow-down"/>
            置于底层
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import { Subject, fromEvent, merge } from 'rxjs'
  import {
    takeWhile, takeUntil, switchMap,
    tap, map, withLatestFrom, filter,
    first
  } from 'rxjs/operators'
  import anime from 'animejs'
  import AdjustMixins from './AdjustMixins'
  import Widget from '@/model/widget'
  import WrapperService from '@/components/Wrapper/WrapperService'
  import { ScreenMutations } from '@/store/modules/screen'
  import { mapGetters, mapMutations, mapState } from 'vuex'
  import CommonConfig from '@/model/config/commonConfig'

  export default {
    name: 'Wrapper',
    data: () => ({
      isSubscribed: true,
      originalState: null,
      config: null,
      wrapperService: new WrapperService()
    }),
    mixins: [AdjustMixins],
    mounted () {
      this.change$ = new Subject()
      this.documentMove$ = fromEvent(document, 'mousemove')
      this.documentUp$ = fromEvent(document, 'mouseup')
      this.tl$ = fromEvent(this.$refs.tl, 'mousedown').pipe(
        map(event => ({ type: 'tl', event }))
      )
      this.tc$ = fromEvent(this.$refs.tc, 'mousedown').pipe(
        map(event => ({ type: 'tc', event }))
      )
      this.tr$ = fromEvent(this.$refs.tr, 'mousedown').pipe(
        map(event => ({ type: 'tr', event }))
      )
      this.cr$ = fromEvent(this.$refs.cr, 'mousedown').pipe(
        map(event => ({ type: 'cr', event }))
      )
      this.br$ = fromEvent(this.$refs.br, 'mousedown').pipe(
        map(event => ({ type: 'br', event }))
      )
      this.bc$ = fromEvent(this.$refs.bc, 'mousedown').pipe(
        map(event => ({ type: 'bc', event }))
      )
      this.bl$ = fromEvent(this.$refs.bl, 'mousedown').pipe(
        map(event => ({ type: 'bl', event }))
      )
      this.cl$ = fromEvent(this.$refs.cl, 'mousedown').pipe(
        map(event => ({ type: 'cl', event }))
      )
      this.move$ = fromEvent(this.$refs.move, 'mousedown').pipe(
        map(event => ({ type: 'move', event }))
      )
      this.all$ = merge(
        this.tl$, this.tc$, this.tr$, this.cr$,
        this.br$, this.bc$, this.bl$, this.cl$, this.move$
      )

      this.all$
        .pipe(
          takeWhile(() => this.isSubscribed),
          tap(({ event }) => {
            event.preventDefault()
            event.stopPropagation()
            // 鼠标按下后所处位置的相对位置
            const {
              top, left, width, height
            } = window.getComputedStyle(this.$refs.wrapper, null)
            this.originalState = {
              top: Number(top.split('px')[0]) || 0,
              left: Number(left.split('px')[0]) || 0,
              width: Number(width.split('px')[0]) || 0,
              height: Number(height.split('px')[0]) || 0
            }
          }),
          map(() => this.documentMove$.pipe(takeUntil(this.documentUp$))),
          switchMap(move$ => merge(this.documentUp$.pipe(first()), move$)),
          withLatestFrom(this.all$, (events, { type, event }) => {
            const { pageX, pageY } = events
            // 鼠标事件类型
            const mouseType = events.type
            // 缩放类型
            let eventType
            // 缩放方向
            let direction = null
            // 缩放距离
            let distance = 0
            // 移动的相对位置
            let position = null
            // 横坐标方向移动距离
            const xDistance = pageX - event.pageX
            // 纵坐标方向移动距离
            const yDistance = pageY - event.pageY
            if (['tl', 'tr', 'br', 'bl'].includes(type)) {
              // 等比例缩放
              eventType = 'SCALE'
              // 对于等比例缩放，选择移动最小距离
              distance = Math.abs(xDistance) < Math.abs(yDistance) ? xDistance : yDistance
              switch (type) {
                case 'tl':
                  if (xDistance >= 0 && yDistance >= 0) {
                    direction = 'REDUCE'
                  } else if (xDistance < 0 && yDistance < 0) {
                    direction = 'EXPAND'
                  }
                  break

                case 'tr':
                  if (xDistance >= 0 && yDistance <= 0) {
                    direction = 'EXPAND'
                  } else if (xDistance < 0 && yDistance > 0) {
                    direction = 'REDUCE'
                  }
                  break

                case 'br':
                  if (xDistance >= 0 && yDistance >= 0) {
                    direction = 'EXPAND'
                  } else if (xDistance < 0 && yDistance < 0) {
                    direction = 'REDUCE'
                  }
                  break

                case 'bl':
                  if (xDistance >= 0 && yDistance <= 0) {
                    direction = 'REDUCE'
                  } else if (xDistance < 0 && yDistance > 0) {
                    direction = 'EXPAND'
                  }
                  break

                default:
                  break
              }
            } else if (['tc', 'cr', 'bc', 'cl'].includes(type)) {
              // 单向缩放
              eventType = 'SINGLE'
              switch (type) {
                case 'tc':
                  direction = yDistance >= 0 ? 'REDUCE' : 'EXPAND'
                  distance = -yDistance
                  break

                case 'cr':
                  direction = xDistance >= 0 ? 'EXPAND' : 'REDUCE'
                  distance = xDistance
                  break

                case 'bc':
                  direction = yDistance >= 0 ? 'EXPAND' : 'REDUCE'
                  distance = yDistance
                  break

                case 'cl':
                  direction = xDistance >= 0 ? 'EXPAND' : 'REDUCE'
                  distance = -xDistance
                  break

                default:
                  break
              }
            } else {
              // 移动
              eventType = 'MOVE'
              direction = 'ANY'
              position = {
                top: yDistance,
                left: xDistance
              }
            }
            return {
              type,
              eventType,
              direction,
              distance,
              position,
              mouseType
            }
          }),
          filter(({ direction }) => direction)
        )
        .subscribe((event) => {
          const mutation = {
            event,
            originalState: this.originalState
          }
          this.$emit('adjust', mutation)
          this.adjust({
            target: this.$refs.wrapper,
            mutation
          })
        })
      return {}
    },
    computed: {
      // 是否允许同步配置
      isAllowAsync () {
        return this.config && this.activeWidget && this.config.type === this.activeWidget.config.type
      }
    },
    methods: {
      ...mapMutations('screen', {
        resetTopologyState: ScreenMutations.RESET_TOPOLOGY_STATE,
        activateWidget: ScreenMutations.ACTIVATE_WIDGET
      }),
      /**
       * 设置
       * @param display
       * @param top
       * @param left
       * @param width
       * @param height
       */
      setSize ({
        display, top, left, width, height
      }) {
        anime.set(this.$refs.wrapper, {
          display,
          top,
          left,
          width,
          height
        })
      },
      /**
       * 复制部件
       */
      copyWidget () {
        const { config } = this.activeWidget
        const { commonConfig: { top, left } } = config
        const copyConfig = _.cloneDeep(config)
        const zIndex = this.view.widgets.length
        Object.assign(copyConfig.commonConfig, {
          top: top + 48,
          left: left + 48,
          zIndex
        })
        const copyWidget = new Widget({ config: copyConfig })
        // 将复制的部件添加入部件列表中
        this.addWidget({ widget: copyWidget })
        // 选择器选中该部件
        this.wrapperService.next({ el: 'widget', widget: copyWidget })
      },
      /**
       * 复制配置
       */
      copyConfig () {
        this.config = _.cloneDeep(this.activeWidget.config)
      },
      /**
       * 粘贴配置
       */
      syncConfig () {
        const activeWidget = _.cloneDeep(this.activeWidget)
        const { render, config: { commonConfig: { width, height, top, left } } } = this.activeWidget
        // 保留当前部件基础配置不变
        Object.assign(this.config.commonConfig, {
          width,
          height,
          top,
          left
        })
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
        this.$nextTick(() => {
          render.setConfig(this.config)
        })
      },
      /**
       * 删除部件
       */
      deleteWidget () {
        const { config: { type } } = this.activeWidget
        if (type === 'Topology') {
          this.resetTopologyState()
        }
        this.removeWidget({ widgetId: this.activeWidget.widgetId })
      },
      /*
    * Widget置于顶层
    * */
      upzIndexWidget () {
        const copyConfig = _.cloneDeep(this.activeWidget.config)
        // 生成一个数组,用来记录widgets的每一个index
        let maxArr = []
        for (let i = 0; i < this.view.widgets.length; i++) {
          maxArr.push(this.view.widgets[i].config.commonConfig.zIndex)
        }
        //  获取maxArr里面zIndex的最大值,置于顶层需要大于max
        let max = maxArr.sort((a, b) => {
          return b - a
        })[0]
        //  更新置顶的 this.activeWidget公共属性的zIndex
        copyConfig.commonConfig.zIndex = max + 1
        //  更新vueX里的数据 同步至 页面公共属性的位置>zIndex
        Object.assign(this.activeWidget, { config: copyConfig })
        const copyMutation = {
          event: {
            direction: 'ANY',
            distance: 0,
            eventType: 'MOVE',
            mouseType: 'mousemove',
            position: {
              zIndex: copyConfig.commonConfig.zIndex
            },
            type: 'move'
          },
          originalState: { ...copyConfig.commonConfig }
        }
        // 更新dom里面的数据,让zIndex在页面生效
        this.adjust({
          target: document.getElementById(this.activeWidget.widgetId),
          mutation: copyMutation
        })
      },
      /*
        * Widget置于底层,同理于置于顶层
        * */
      downzIndexWidget () {
        const copyConfig = _.cloneDeep(this.activeWidget.config)
        let minArr = []
        for (let i = 0; i < this.view.widgets.length; i++) {
          minArr.push(this.view.widgets[i].config.commonConfig.zIndex)
        }
        let min = minArr.sort((a, b) => {
          return a - b
        })[0]
        copyConfig.commonConfig.zIndex = min - 1
        Object.assign(this.activeWidget, { config: copyConfig })
        const copyMutation = {
          event: {
            direction: 'ANY',
            distance: 0,
            eventType: 'MOVE',
            mouseType: 'mousemove',
            position: {
              zIndex: copyConfig.commonConfig.zIndex
            },
            type: 'move'
          },
          originalState: { ...copyConfig.commonConfig }
        }
        this.adjust({
          target: document.getElementById(this.activeWidget.widgetId),
          mutation: copyMutation
        })
      }
    },
    beforeDestroy () {
      this.isSubscribed = false
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    top: 0;
    left: 0;
    height: 300px;
    width: 300px;
    position: absolute;
    box-sizing: border-box;
    padding: 5px;
    border: 1px solid #0098f7;
    z-index: 1000;
    display: none;

    &__mask {
      display: none;
      position: fixed;
      background: transparent;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 999;
    }

    &__move {
      position: relative;
      height: 100%;
      width: 100%;
      cursor: move;
      z-index: 1000;
      pointer-events: auto;
    }

    &__handler {
      position: absolute;
      height: 10px;
      width: 10px;
      border-radius: 2px;
      background: #0098f7;
      z-index: 1000;

      &--ti {
        top: -5px;
        left: -5px;
        font-size: 40px;
        cursor: nwse-resize;
      }

      &--tl {
        top: -5px;
        left: -5px;
        cursor: nwse-resize;
      }

      &--tc {
        top: -5px;
        left: calc(50% - 5px);
        cursor: ns-resize;
      }

      &--tr {
        top: -5px;
        right: -5px;
        cursor: nesw-resize;
      }

      &--cr {
        top: calc(50% - 5px);
        right: -5px;
        cursor: ew-resize;
      }

      &--br {
        bottom: -5px;
        right: -5px;
        cursor: nwse-resize;
      }

      &--bc {
        bottom: -5px;
        right: calc(50% - 5px);
        cursor: ns-resize;
      }

      &--bl {
        bottom: -5px;
        left: -5px;
        cursor: nesw-resize;
      }

      &--cl {
        top: calc(50% - 5px);
        left: -5px;
        cursor: ew-resize;
      }
    }

    &__menu {
      width: 160px;

      &--primary {
        color: #1890ff;
      }

      &--danger {
        color: #ff4d4f;
      }

      &--up {
        color: #52c41a;
      }

      &--down {
        color: #1a1dc4;
      }
    }
  }
</style>
