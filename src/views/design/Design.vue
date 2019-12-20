<template>
  <div class="design">
    <div class="design__header">
      <p>视图设计</p>
    </div>
    <div class="design__content">
      <transition name="panel">
        <div class="design__left" v-if="leftPanelExpand">
          <Template />
        </div>
      </transition>
      <div class="design__center">
        <Screen @left="leftPanelControl" @right="rightPanelControl"/>
      </div>
      <transition name="panel">
        <div class="design__right" v-if="rightPanelExpand">
          <Config />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Screen from './moduels/screen/index'
import Template from './moduels/template/index'
import Config from './moduels/config/index'

export default {
  name: 'Design',
  components: {
    Screen,
    Template,
    Config
  },
  data: () => ({
    leftPanelExpand: true,
    rightPanelExpand: true
  }),
  methods: {
    leftPanelControl (control) {
      this.leftPanelExpand = control
    },
    rightPanelControl (control) {
      this.rightPanelExpand = control
    }
  }
}
</script>

<style scoped lang="less">
.design {
  &__header {
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 54px;
    box-sizing: border-box;
    padding: 0 24px;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, .25);

    p {
      color: #757575;
      font-weight: bold;
      font-size: 16px;
      margin: 0;
    }
  }

  &__content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 100%;
    width: 100vw;
  }

  &__left {
    flex: none;
    width: 240px;
    background: white;
    overflow: hidden;
  }

  &__center {
    width: 100%;
    overflow: auto;
    background: white;
  }

  &__right {
    flex: none;
    width: 320px;
    background: white;
  }
}

/* panel 过度动画 */
.panel-enter-active, .panel-leave-active {
  transition: all 400ms cubic-bezier(.25,.8,.25,1);
}

.panel-enter, .panel-leave-to {
  width: 0;
}
</style>
