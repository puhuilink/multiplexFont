/**
* 部件选择器
* Author: dong xing
* Date: 2019/11/13
* Time: 5:27 下午
* Email: dong.xing@outlook.com
*/
<template>
  <fragment>

    <!-- / 拖拽缩放与右键菜单 -->
    <div
      id="wrapper"
      class="wrapper"
      ref="wrapper"
      tabindex="1"
      @click="focus"
    >
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
          <div :style="{ height: '100%' }"></div>
          <a-menu slot="overlay" class="wrapper__menu">
            <a-menu-item key="copyWidget" class="wrapper__menu--primary" @click="copyWidget"><a-icon type="copy" />复制部件</a-menu-item>
            <a-menu-item key="copyConfig" class="wrapper__menu--primary" @click="copyConfig"><a-icon type="snippets" />复制配置</a-menu-item>
            <a-sub-menu key="syncConfig" :disabled="!isAllowAsync">
              <span slot="title" :class="[isAllowAsync ? 'wrapper__menu--primary': '']"><a-icon type="sync" />同步配置</span>
              <a-menu-item key="all" @click="syncConfig(['commonConfig', 'proprietaryConfig', 'dataConfig'])">全部配置</a-menu-item>
              <a-menu-divider />
              <a-menu-item key="commonConfig" @click="syncConfig(['commonConfig'])">公共属性</a-menu-item>
              <a-menu-item key="proprietaryConfig" @click="syncConfig(['proprietaryConfig'])">专有属性</a-menu-item>
              <a-menu-item key="dataConfig" @click="syncConfig(['dataConfig'])">数据配置</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="deleteWidget" class="wrapper__menu--danger" @click="deleteWidget"><a-icon type="delete" />删除</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="close"><a-icon type="close" />取消</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <!-- / 自动对齐提示线 -->
    <div
      class="autoAlign__line autoAlign__line_x"
      :class="{ 'autoAlign__line_show': typeof autoAlignState.top === 'number' }"
      :style="{ top: `${autoAlignState.top}px` }"
    />
    <div
      class="autoAlign__line autoAlign__line_y"
      :class="{ 'autoAlign__line_show': typeof autoAlignState.left === 'number' }"
      :style="{ left: `${autoAlignState.left}px` }"
    />

  </fragment>
</template>

<script>
import _ from 'lodash'
import { fromEvent, merge, Subject } from 'rxjs'
import {
  takeWhile, takeUntil, switchMap,
  tap, map, withLatestFrom, filter,
  first
} from 'rxjs/operators'
import anime from 'animejs'
import AdjustMixins from './AdjustMixins'
import Widget from '@/model/widget'
import WrapperService from '@/components/Wrapper/WrapperService'
import AutoAlignService from '@/components/Wrapper/AutoAlignService'
import { ScreenMutations } from '@/store/modules/screen'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'Wrapper',
  data: () => ({
    isSubscribed: true,
    isMousedown: false,
    isShiftPressed: false,
    originalState: null,
    config: null,
    wrapperService: new WrapperService(),
    autoAlignService: new AutoAlignService(),
    autoAlignState: {
      top: null,
      left: null
    }
  }),
  mixins: [AdjustMixins],
  mounted () {
    this.initEvent()
  },
  computed: {
    ...mapGetters('screen', ['positionYs', 'positionXs', 'scale']),
    isAllowAsync () {
      return this.config && this.activeWidget && this.config.type === this.activeWidget.config.type
    }
  },
  methods: {
    ...mapMutations('screen', {
      resetTopologyState: ScreenMutations.RESET_TOPOLOGY_STATE
    }),
    test ({ key, domEvent }) {
      console.log(key, domEvent)
    },
    initEvent () {
      this.adjust$ = new Subject()
      this.adjust$
        .pipe(
          takeWhile(() => this.isSubscribed)
        )
        .subscribe(mutation => {
          this.$emit('adjust', mutation)
          this.adjust({
            target: this.$refs.wrapper,
            mutation
          })
        })
      this.initKeyboardEvent()
      this.initScaleAndMoveEvent()
    },
    /**
     * 初始化自动对齐事件
     */
    initAutoAlignEvent () {
      this.autoAlignService.change$
        .pipe(
          takeWhile(() => this.isSubscribed),
          filter(({ type }) => type === 'MOVE')
        )
        .subscribe(({ event }) => {
          const {
            x: left,
            y: top
          } = event
          Object.assign(this.autoAlignState, { top, left })
        })
    },
    /**
     * 初始化键盘热键事件
     */
    initKeyboardEvent () {
      this.keydown$ = fromEvent(this.$refs.wrapper, 'keydown').pipe(
        takeWhile(() => this.isSubscribed),
        map(event => ({ type: 'keydown', event }))
      )
      this.keyup$ = fromEvent(this.$refs.wrapper, 'keyup').pipe(
        takeWhile(() => this.isSubscribed),
        map(event => ({ type: 'keyup', event }))
      )
      this.keypress$ = merge(this.keydown$, this.keyup$)

      // 鼠标未按下时使用方向键微调定位
      this.arrow$ = this.keypress$
        .pipe(
          filter(({ event }) => ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.code)),
          filter(({ type }) => type === 'keydown'),
          filter(() => !this.isMousedown),
          tap(({ event }) => this.setOriginalState(event))
        )
        .subscribe(({ event }) => {
          let top = 0
          let left = 0
          switch (event.code) {
            case 'ArrowUp':
              top = -1
              break
            case 'ArrowRight':
              left = 1
              break
            case 'ArrowDown':
              top = 1
              break
            case 'ArrowLeft':
              left = -1
              break
            default:
              break
          }
          const mutation = {
            originalState: this.originalState,
            event: {
              // 与直接拖拽后鼠标抬起表现一致
              mouseType: 'mouseup',
              eventType: 'MOVE',
              position: {
                top: top * this.scale,
                left: left * this.scale
              }
            }
          }
          this.adjust$.next(mutation)
        })

      // 鼠标按下时按住 Shift 关闭自动对齐
      this.shift$ = this.keypress$
        .pipe(
          filter(({ event }) => ['ShiftLeft', 'ShiftRight'].includes(event.code))
        )
        .subscribe(({ type, event }) => {
          this.isShiftPressed = type === 'keydown'
          if (this.isShiftPressed) {
            this.autoAlignService.next({
              type: 'MOVE',
              event: { x: null, y: null }
            })
          }
        })

      // 鼠标按下时按下并抬起 Esc 恢复到之前状态
      this.esc$ = this.keyup$
        .pipe(
          filter(() => this.isMousedown),
          filter(({ event }) => ['Escape'].includes(event.code)),
          tap(({ event }) => {
            event.preventDefault()
            event.stopPropagation()
          })
        )
        .subscribe(() => {
          // TODO: 取消当前正在订阅中的 scaleAndMoveEvent
          // const mutation = {
          //   event: {
          //     direction: 'ANY',
          //     distance: 0,
          //     eventType: 'MOVE',
          //     mouseType: 'mouseup',
          //     position: { top: 0, left: 0 }
          //   },
          //   originalState: this.originalState
          // }
          // this.adjust$.next(mutation)
        })
    },
    /**
     * 初始化鼠标拖拽与缩放事件
     */
    initScaleAndMoveEvent () {
      this.initAutoAlignEvent()
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
          tap(({ event }) => this.setOriginalState(event)),
          map(() => this.documentMove$.pipe(takeUntil(this.documentUp$))),
          switchMap(move$ => merge(this.documentUp$.pipe(first()), move$)),
          withLatestFrom(this.all$, (events, { type, event }) => {
            this.isMousedown = true
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
            } else if (type === 'move') {
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
          this.adjust$.next(mutation)
        })
    },
    getCurrentState () {
      const {
        top, left, width, height
      } = window.getComputedStyle(this.$refs.wrapper, null)
      return {
        top: Number(top.split('px')[0]) || 0,
        left: Number(left.split('px')[0]) || 0,
        width: Number(width.split('px')[0]) || 0,
        height: Number(height.split('px')[0]) || 0
      }
    },
    setOriginalState (event) {
      event.preventDefault()
      event.stopPropagation()
      this.originalState = this.getCurrentState()
    },
    focus () {
      this.$refs.wrapper.focus()
    },
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
        height,
        // FIXME: zIndex 某时会被重置为0
        zIndex: 1000
      })
      if (display !== 'none') {
        this.focus()
      }
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
      this.config = this.activeWidget.config
    },
    /**
       * 粘贴配置
       * @param {Array} configTypes 要合并的配置名
       */
    syncConfig (configTypes) {
      const { render, ...rest } = this.activeWidget
      const activeWidget = { ..._.cloneDeep(rest), render }
      const { config: { commonConfig: { width, height, top, left } } } = this.activeWidget

      // 不合并尺寸位置信息
      Object.assign(this.config.commonConfig, {
        width,
        height,
        top,
        left
      })

      // 按需合并配置
      Object.assign(activeWidget.config, _.pick(this.config, configTypes))

      // 提交与刷新
      this.activateWidget({ widget: activeWidget })
      this.$nextTick(() => {
        render.setConfig(activeWidget.config)
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
    }
  }

  .autoAlign__line {
    position: absolute;
    z-index: 1000;
    opacity: 0;
    background-color: rgba(11,241,255,1);

    &_show {
      opacity: 1;
    }

    &_x {
      width: 100%;
      height: 3px;
    }

    &_y {
      width: 3px;
      height: 100%;
    }

  }
</style>
