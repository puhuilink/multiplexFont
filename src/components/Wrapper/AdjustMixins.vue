/**
* dom元素调整 mixins
* Author: dong xing
* Date: 2019/11/15
* Time: 2:32 下午
* Email: dong.xing@outlook.com
*/
<script>
import anime from 'animejs'
import { mapState, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import _ from 'lodash'

export default {
  name: 'AdjustMixins',
  data: () => ({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  }),
  computed: {
    ...mapState('screen', ['view', 'activeWidget'])
  },
  methods: {
    ...mapMutations('screen', {
      addWidget: ScreenMutations.ADD_WIDGET,
      activateWidget: ScreenMutations.ACTIVATE_WIDGET,
      removeWidget: ScreenMutations.REMOVE_WIDGET
    }),
    /**
       * 通用dom元素调整方法，以方便部件使用
       * @param target dom元素
       * @param mutation wrapper选择器标准事件流
       */
    // Todo 修改事件流格式，格式化为绝对位置进行修改
    adjust ({ target, mutation }) {
      const { scale } = this.view
      const { event, originalState } = mutation
      const {
        eventType, position, distance, type, direction
      } = event
      // 初始位置
      const {
        top, left, width, height
      } = originalState
      switch (eventType) {
        case 'MOVE':
          anime.set(target, {
            // 如果元素是通过自动对齐移动过来
            // 直接使用对齐后的位置，即 closest*，不用 scale 计算以避免精度丢失
            top: _.get(position, ['closestTop'], top + position.top / scale),
            left: _.get(position, ['closestLeft'], left + position.left / scale),
            zIndex: position.zIndex
          })
          break
        case 'SINGLE':
          switch (type) {
            case 'tc':
              anime.set(target, {
                top: top - distance / scale,
                height: height + distance / scale
              })
              break
            case 'cr':
              anime.set(target, {
                width: width + distance / scale
              })
              break
            case 'bc':
              anime.set(target, {
                height: height + distance / scale
              })
              break
            case 'cl':
              anime.set(target, {
                left: left - distance / scale,
                width: height + distance / scale
              })
              break
            default:
              break
          }
          break
        case 'SCALE':
          // eslint-disable-next-line no-case-declarations
          const absDistance = direction === 'EXPAND'
            ? Math.abs(distance) : -Math.abs(distance)
          switch (type) {
            case 'tl':
              anime.set(target, {
                top: top + distance / scale,
                left: left + distance / scale,
                width: width - distance / scale,
                height: height - distance / scale
              })
              break
            case 'tr':
              anime.set(target, {
                top: top - absDistance / scale,
                width: width + absDistance / scale,
                height: height + absDistance / scale
              })
              break
            case 'br':
              anime.set(target, {
                width: width + distance / scale,
                height: height + distance / scale
              })
              break
            case 'bl':
              anime.set(target, {
                left: left - absDistance / scale,
                width: width + absDistance / scale,
                height: height + absDistance / scale
              })
              break
            default:
              break
          }
          break
        default:
          break
      }
    }
  }
}
</script>
