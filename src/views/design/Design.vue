/**
* 设计视图
* Author: dong xing
* Date: 2020/3/1
* Time: 18:44
* Email: dong.xing@outlook.com
*/

<template>
  <div class="design">
    <div class="header">
      <p>视图设计 - {{ routeQuery.title }}</p>
      <a-button shape="circle" @click="back">
        <a-icon type="close"></a-icon>
      </a-button>
    </div>
    <div class="content">
      <transition name="panel">
        <div class="left" v-show="leftPanelExpand">
          <a-tabs defaultActiveKey="3">
            <a-tab-pane tab="组件库" key="1" forceRender>
              <Template />
            </a-tab-pane>
            <!--            <a-tab-pane tab="视图" key="2"></a-tab-pane>-->
            <a-tab-pane tab="CI" key="3" forceRender>
              <Ci />
            </a-tab-pane>
          </a-tabs>
        </div>
      </transition>
      <div class="center">
        <Screen @left="leftPanelControl" @right="rightPanelControl"/>
      </div>
      <transition name="panel">
        <div class="right" v-show="rightPanelExpand">
          <Config />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Screen from './modules/screen/index'
import Template from './modules/template/index'
import Config from './modules/config/index'
import Ci from './modules/ci/index'

export default {
  name: 'Design',
  components: {
    Screen,
    Template,
    Config,
    Ci
  },
  data: () => ({
    // 左区域展开
    leftPanelExpand: true,
    // 左区域展开
    rightPanelExpand: true
  }),
  computed: {
    routeQuery () {
      return this.$route.query
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    leftPanelControl (control) {
      this.leftPanelExpand = control
    },
    rightPanelControl (control) {
      this.rightPanelExpand = control
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$confirm({
      title: '确认要离开当前视图？',
      content: '请确认以保存当前视图，未保存内容则不会生效！',
      onOk () {
        next(true)
      },
      onCancel () {
        next(false)
      }
    })
  }
}
</script>

<style scoped lang="less">
  .design {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .header {
    position: relative;
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 54px;
    box-sizing: border-box;
    padding: 0 16px;
    background: white;
    box-shadow: 0 2px 8px #f0f1f2;
    z-index: 5;

    p {
      color: #757575;
      font-weight: bold;
      font-size: 18px;
      margin: 0;
    }
  }

  .content {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 100%;
    width: 100vw;
  }

  .left {
    flex: none;
    width: 240px;
    background: white;
    overflow: hidden;
  }

  .center {
    width: 100%;
    overflow: auto;
    background: white;
  }

  .right {
    flex: none;
    width: 320px;
    background: white;
  }

  /* panel 过度动画 */
  .panel-enter-active, .panel-leave-active {
    transition: all 400ms cubic-bezier(.25,.8,.25,1);
  }

  .panel-enter, .panel-leave-to {
    width: 0;
  }

</style>
