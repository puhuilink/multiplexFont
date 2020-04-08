/**
* 数据源选择模板
* Author: dong xing
* Date: 2019/12/6
* Time: 4:09 下午
* Email: dong.xing@outlook.com
*/

<template>
  <div class="data-source common-template">

    <a-collapse :activeKey="[1, 2, 3]" :bordered="false">

      <!-- S 数据源 -->
      <a-collapse-panel header="数据源类型" key="1">

        <div class="comment-template__item">
          <p class="comment-template__leading">选择:</p>
          <div class="comment-template__inner">
            <a-select
              class="data-source__select"
              v-model="config.dataConfig.sourceType"
              @change="change">
              <a-select-option value="null">空数据</a-select-option>
              <a-select-option value="static">静态数据</a-select-option>
              <a-select-option value="real">实时数据</a-select-option>
            </a-select>
          </div>

        </div>
        <!-- / 数据源选择 -->

      </a-collapse-panel>
      <!-- E 数据源 -->

      <a-collapse-panel header="数据源配置" key="2" v-show="sourceType === 'real'">
        <!-- 留给组件自己实现 -->
        <!-- <slot name="null" v-show="sourceType === 'null'"></slot> -->
        <!-- <slot name="static" v-show="sourceType === 'static'"></slot> -->
        <slot name="real" v-show="sourceType === 'real'"></slot>
      </a-collapse-panel>

      <!-- S 静态数据编辑 -->
      <a-collapse-panel header="静态数据编辑" key="3" v-show="sourceType === 'static'">

        <div class="data-source__wrap">
          <AceEditor
            v-if="code"
            class="data-source__editor"
            language="json"
            :code="code"
            @change="staticSourceChange" />
        </div>

      </a-collapse-panel>
      <!-- E 静态数据编辑 -->

    </a-collapse>

  </div>
</template>

<script>
import '@/assets/less/template.less'
import _ from 'lodash'
import AceEditor from 'vue-ace-editor-valid'
import { mapState, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'

export default {
  name: 'DataSourceTemplate',
  components: {
    AceEditor
  },
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    },
    sourceType () {
      return this.config.dataConfig.sourceType || 'null'
    },
    code () {
      // 柱形图根据类型调整样式
      const { barType } = this.config.proprietaryConfig
      const getCode = _.get(this.activeWidget, 'config.dataConfig.staticDataConfig.getCode')
      return getCode ? getCode.call(this.activeWidget.config.dataConfig.staticDataConfig, barType) : null
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    /**
     * 静态资源修改
     * @param code 静态资源代码
     */
    staticSourceChange (code) {
      if (code !== '') {
        // 在不同类型的静态数据配置类中配置自己的更新方法
        this.config.dataConfig.staticDataConfig.updateStaticData(this.config, code)
        this.change()
      }
    },
    change () {
      const activeWidget = _.cloneDeep(this.activeWidget)
      const { render } = this.activeWidget
      Object.assign(activeWidget.config, this.config)
      this.activateWidget({
        widget: Object.assign(activeWidget, { render })
      })
      render.mergeOption(this.config)
    }
  }
}
</script>

<style scoped lang="less">
.data-source {

  &__select {
    width: 100%;
  }

  &__wrap {
    height: calc(100vh - 388px);
  }

  &__editor {
    border-radius: 4px;
    background: #f1f1f1;
    font-size: 14px;
  }
}
</style>
