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
            <a-menu-item key="1" class="wrapper__menu--primary" @click="copyWidget"><a-icon type="copy" />复制部件</a-menu-item>
            <a-menu-item key="2" class="wrapper__menu--primary" @click="copyConfig"><a-icon type="snippets" />复制配置</a-menu-item>
            <a-menu-item key="3" :disabled="!isAllowAsync" :class="[isAllowAsync ? 'wrapper__menu--primary' : '']" @click="syncConfig"><a-icon type="sync" />同步配置</a-menu-item>
            <a-menu-item key="4" class="wrapper__menu--danger" @click="deleteWidget"><a-icon type="delete" />删除</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="5"><a-icon type="close" />取消</a-menu-item>
            <a-menu-item key="6" class="wrapper__menu--up" @click="upzIndexWidget"><a-icon type="arrow-up" />置于顶层</a-menu-item>
            <a-menu-item key="7" class="wrapper__menu--down" @click="downzIndexWidget"><a-icon type="arrow-down" />置于底层</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <!-- / 自动对齐提示线 -->
    <div
      class="autoAlign__line autoAlign__line_x"
      :class="{ autoAlign__line_show: typeof autoAlignState.top === 'number' }"
      :style="{ top: `${autoAlignState.top}px` }"
    />
    <div
      class="autoAlign__line autoAlign__line_y"
      :class="{ autoAlign__line_show: typeof autoAlignState.left === 'number' }"
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
import { findClosestNumInArr } from '@/utils/util'

const CLOSEST_PIXEL = 20

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
    initEvent () {
      this.adjust$ = new Subject()
      this.adjust$
        .pipe(
          takeWhile(() => this.isSubscribed)
        )
        .subscribe((mutation) => {
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
        map((event) => ({ type: 'keydown', event }))
      )
      this.keyup$ = fromEvent(this.$refs.wrapper, 'keyup').pipe(
        takeWhile(() => this.isSubscribed),
        map((event) => ({ type: 'keyup', event }))
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
        map((event) => ({ type: 'tl', event }))
      )
      this.tc$ = fromEvent(this.$refs.tc, 'mousedown').pipe(
        map((event) => ({ type: 'tc', event }))
      )
      this.tr$ = fromEvent(this.$refs.tr, 'mousedown').pipe(
        map((event) => ({ type: 'tr', event }))
      )
      this.cr$ = fromEvent(this.$refs.cr, 'mousedown').pipe(
        map((event) => ({ type: 'cr', event }))
      )
      this.br$ = fromEvent(this.$refs.br, 'mousedown').pipe(
        map((event) => ({ type: 'br', event }))
      )
      this.bc$ = fromEvent(this.$refs.bc, 'mousedown').pipe(
        map((event) => ({ type: 'bc', event }))
      )
      this.bl$ = fromEvent(this.$refs.bl, 'mousedown').pipe(
        map((event) => ({ type: 'bl', event }))
      )
      this.cl$ = fromEvent(this.$refs.cl, 'mousedown').pipe(
        map((event) => ({ type: 'cl', event }))
      )
      this.move$ = fromEvent(this.$refs.move, 'mousedown').pipe(
        map((event) => ({ type: 'move', event }))
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
          switchMap((move$) => merge(this.documentUp$.pipe(first()), move$)),
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

              // 自动对齐计算与处理
              // Shift 按下时关闭自动对齐
              // 因不稳定暂时关闭自动对齐
              // if (!this.isShiftPressed) {
              //   const { closestTop, closestLeft, x, y } = this.calcClosestPosition()
              //   if (mouseType === 'mouseup') {
              //     this.isMousedown = false
              //     Object.assign(position, { closestTop, closestLeft })
              //     this.autoAlignService.next({
              //       type: 'MOVE',
              //       event: { x: null, y: null }
              //     })
              //   } else {
              //     this.autoAlignService.next({
              //       type: 'MOVE',
              //       event: { x, y }
              //     })
              //   }
              // }
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
    /**
     * 计算距离当前位置最近的可自动对齐的位置和高亮线条位置
     */
    calcClosestPosition () {
      const { top, left, width, height } = this.getCurrentState()

      const OFFSET = CLOSEST_PIXEL / this.scale

      // 上侧最近位置
      const yTop = findClosestNumInArr(this.positionYs, top, OFFSET)
      // 下侧最近位置
      const yBottom = findClosestNumInArr(this.positionYs, top + height, OFFSET)
      // 左侧最近位置
      const xLeft = findClosestNumInArr(this.positionXs, left, OFFSET)
      // 右侧最近位置
      const xRight = findClosestNumInArr(this.positionXs, left + width, OFFSET)

      // 要吸附到的 top
      let closestTop
      // 要吸附到的 left
      let closestLeft
      // 自动对齐线条高亮的 top
      let y
      // 自动对齐线条高亮的 left
      let x

      if (
        (typeof yTop === 'number' &&
          typeof yBottom === 'number' &&
          Math.abs(yTop - top) <= Math.abs(yBottom - (top + height))) ||
        (typeof yTop === 'number' && typeof yBottom !== 'number')
      ) {
        // 上侧吸附与高亮
        y = yTop
        closestTop = yTop
      } else if (typeof yBottom === 'number') {
        // 下侧吸附与高亮
        y = yBottom
        closestTop = yBottom - height
      }

      if (
        (typeof xLeft === 'number' &&
          typeof xRight === 'number' &&
          Math.abs(xLeft - left) <= Math.abs(xRight - (left + width))) ||
        (typeof xLeft === 'number' && typeof xRight !== 'number')
      ) {
        // 左侧吸附与高亮
        x = xLeft
        closestLeft = xLeft
      } else if (typeof xRight === 'number') {
        // 右侧吸附与高亮
        x = xRight
        closestLeft = xRight - width
      }

      return { closestTop, closestLeft, x, y }
    },
    getCurrentState () {
      const { top, left, width, height } = window.getComputedStyle(this.$refs.wrapper, null)
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
    setSize ({ display, top, left, width, height }) {
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
      const {
        commonConfig: { top, left }
      } = config
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
      const {
        config: { type }
      } = this.activeWidget
      if (type === 'Topology') {
        this.resetTopologyState()
      }
      this.removeWidget({ widgetId: this.activeWidget.widgetId })
    },
    /**
     * Widget置于顶层
     */
    upzIndexWidget () {
      const copyConfig = _.cloneDeep(this.activeWidget.config)
      copyConfig.commonConfig.zIndex = Math.max(...this.view.widgets.map(({ config }) => config.commonConfig.zIndex)) + 1
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
      copyConfig.commonConfig.zIndex = 0
      Object.assign(this.activeWidget, {
        config: copyConfig
      }
      )
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

.autoAlign__line {
  position: absolute;
  z-index: 1000;
  opacity: 0;
  background-color: rgba(11, 241, 255, 1);

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
