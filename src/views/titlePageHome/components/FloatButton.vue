<template>
  <div>
    <div
      ref="floatDrag"
      class="float-position"
      id="float-box"
      :style="{top: top + 'px', right: right + 'px', zIndex: zIndex, left: left + 'px' }"
      @touchmove.prevent
      @mousemove.prevent
      @mousedown="mouseDown"
      @mouseup="mouseUp">
      <div class="drag">
        <img src="../assets/zybj.png" alt="" class="imageBox_1" @click="setFun()">
      </div>
      <div class="drag_button" id="content" >
        <div class="imageBox_2">
          <div class="imageBox_2_top" @click="Tickets()"></div>
          <div class="imageBox_2_button" @click="Customer()"></div>
        </div>
      </div>
    </div>
    <SetUp ref="auth" :allLinkListMenuCard="allLinkListMenuCard"></SetUp>
  </div>

</template>

<script>
import SetUp from './SetUp'

export default {
  name: 'FloatButton',
  components: {
    SetUp
  },
  // inject: ['allLinkList_menu'],
  props: {
    allLinkListMenuCard: {
      type: Object,
      default: () => ({})
    },
    distanceRight: {
      type: Number,
      default: 36
    },
    distanceBottom: {
      type: Number,
      default: 220
    },
    isScrollHidden: {
      type: Boolean,
      default: false
    },
    isCanDraggable: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 50
    },
    value: {
      type: String,
      default: '悬浮球！'
    }
  },
  data () {
    return {
      clientWidth: null,
      clientHeight: null,
      left: null,
      top: 2000,
      right: 10,
      timer: null,
      currentTop: 0,
      mousedownX: 0,
      mousedownY: 0,

      flag: true, // 控制悬浮框是否展开
      box: '', // 悬浮球的dom
      activeIndex: 0 // 高亮显示
    }
  },
  created () {
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
  },
  mounted () {
    this.isCanDraggable && this.$nextTick(() => {
      this.floatDrag = this.$refs.floatDrag
      // 获取元素位置属性
      this.floatDragDom = this.floatDrag.getBoundingClientRect()
      // 设置初始位置
      // this.left = this.clientWidth - this.floatDragDom.width - this.distanceRight;
      // this.right = 0
      this.top = this.clientHeight - this.floatDragDom.height - this.distanceBottom
      this.initDraggable()
    })
    // this.isScrollHidden && window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize)

    this.box = document.getElementById('float-box')
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    /**
     * 窗口resize监听
     */
    handleResize () {
      this.checkDraggablePosition()
    },
    /**
     * 初始化draggable
     */
    initDraggable () {
      this.floatDrag.addEventListener('touchmove', (e) => this.touchMove(e))
      this.floatDrag.addEventListener('touchend', this.touchEnd)
    },
    mouseDown (e) {
      const event = e || window.event
      this.mousedownX = event.screenX
      this.mousedownY = event.screenY
      const that = this
      const floatDragWidth = this.floatDragDom.width / 2
      const floatDragHeight = this.floatDragDom.height / 2
      if (event.preventDefault) {
        event.preventDefault()
      }
      this.canClick = false
      this.floatDrag.style.transition = 'none'
      document.onmousemove = e => {
        if (this.mousedownY === e.screenY && this.mousedownX === e.screenX) {
          return
        }
        var event = e || window.event
        that.left = event.clientX - floatDragWidth
        that.top = event.clientY - floatDragHeight
        if (that.left < 0) that.left = 0
        if (that.top < 0) that.top = 0
        // 鼠标移出可视区域后给按钮还原
        if (
          event.clientY < 0 ||
          event.clientY > Number(this.clientHeight) ||
          event.clientX > Number(this.clientWidth) ||
          event.clientX < 0
        ) {
          this.right = 10
          this.top = this.clientHeight - this.floatDragDom.height - this.distanceBottom
          document.onmousemove = null
          this.floatDrag.style.transition = 'all 0.3s'
          return
        }
        if (that.left >= document.documentElement.clientWidth - floatDragWidth * 2) {
          that.left = document.documentElement.clientWidth - floatDragWidth * 2
        }
        if (that.top >= that.clientHeight - floatDragHeight * 2) {
          that.top = that.clientHeight - floatDragHeight * 2
        }
      }
    },
    mouseUp (e) {
      const event = e || window.event
      // 标记位
      let flag = false
      // 判断只是单纯的点击，没有拖拽
      if (this.mousedownY === event.screenY && this.mousedownX === event.screenX) {
        // 当单纯点击时,位置不变
        flag = true
      }
      document.onmousemove = null
      this.checkDraggablePosition(flag)
      this.floatDrag.style.transition = 'all 0.3s'
    },

    touchMove (e) {
      this.canClick = true
      if (e.targetTouches.length === 1) {
        // 单指拖动
        const touch = event.targetTouches[0]
        this.left = touch.clientX - this.floatDragDom.width / 2
        this.top = touch.clientY - this.floatDragDom.height / 2
      }
    },
    touchEnd () {
      if (!this.canClick) return // 解决点击事件和touch事件冲突的问题
      this.floatDrag.style.transition = 'all 0.3s'
      this.checkDraggablePosition()
    },
    /**
     * 判断元素显示位置
     * 在窗口改变和move end时调用
     */
    checkDraggablePosition (flag) {
      if (flag) {
        return
      }
      this.clientWidth = document.documentElement.clientWidth
      this.clientHeight = document.documentElement.clientHeight
      if (this.left + this.floatDragDom.width / 2 >= this.clientWidth / 2) {
        // 判断位置是往左往右滑动
        this.left = this.clientWidth - this.floatDragDom.width
      } else {
        this.left = 0
      }
      if (this.top < 0) {
        // 判断是否超出屏幕上沿
        this.top = 0
      }
      if (this.top + this.floatDragDom.height >= this.clientHeight) {
        // 判断是否超出屏幕下沿
        this.top = this.clientHeight - this.floatDragDom.height
      }
    },
    setFun () {
      this.$refs['auth'].showModal()
    },
    Tickets () {
      console.log('工单')
    },
    Customer () {
      console.log('客服')
    }

  }
}
</script>
<style>
html,
body {
  overflow: hidden;
}
</style>
<style scoped lang="less">
.float-position {
  position: fixed;
  z-index: 999 !important;
  right: 20px;
  width: 60px;
  height: 190px;
  //border-radius: 32px;
  // background: rgba(167, 160, 161, .5);
  //cursor: pointer;
  overflow: hidden;
  //user-select: none;

  display: block;
  background: transparent;

  .imageBox_1{
    width: 60px;
  }
  .imageBox_2{
    width: 60px;
    height: 117px;
    //background: url("../assets/kefu.png") 53px no-repeat  ;
    background-image: url("../assets/kefu.png") ;
    background-size: 60px auto; /* Set width to 100%, height auto */
    background-repeat: no-repeat;
    .imageBox_2_top{
      width: 100%;
      height: 50%;
    }
    .imageBox_2_button{
      width: 100%;
      height: 50%;
    }
  }
  .drag {
    width: 53px;
    height: 53px;
    // background: #f2e96a;
    text-align: center;
    margin-bottom: 16px;
  }
  .content {
    width: 53px;
    height: 117px;
    // background: #716af2;
    .label {
      width: 70px;
      height: 35px;
      text-align: center;
      line-height: 35px;
      color: white;
    }
    .label:hover {
      color: rgb(243, 82, 19);
      transition: all 0.5s;
    }
  }
}
</style>
