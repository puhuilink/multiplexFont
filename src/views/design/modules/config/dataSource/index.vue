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
              <a-select-option :value="SOURCE_TYPE_NULL">空数据</a-select-option>
              <a-select-option :value="SOURCE_TYPE_STATIC">静态数据</a-select-option>
              <a-select-option :value="SOURCE_TYPE_REAL" v-if="getSlot(SOURCE_TYPE_REAL)">性能数据</a-select-option>
              <a-select-option :value="SOURCE_TYPE_ALARM" v-if="getSlot(SOURCE_TYPE_ALARM)">告警数据</a-select-option>
              <a-select-option :value="SOURCE_TYPE_OVERVIEW" v-if="getSlot(SOURCE_TYPE_OVERVIEW)">总览数据</a-select-option>
            </a-select>
          </div>

        </div>
        <!-- / 数据源选择 -->

      </a-collapse-panel>
      <!-- E 数据源 -->

      <a-collapse-panel header="数据源配置" key="2" v-show="[SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_OVERVIEW].includes(sourceType)">
        <div
          v-for="type in [SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_OVERVIEW]"
          :key="type"
          class="data-source__wrap"
          v-show="sourceType === type"
        >
          <slot :name="type"></slot>
        </div>
      </a-collapse-panel>

      <!-- S 静态数据编辑 -->
      <a-collapse-panel header="静态数据编辑" key="3" v-show="sourceType === SOURCE_TYPE_STATIC">

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
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_OVERVIEW
} from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'DataSourceTemplate',
  components: {
    AceEditor
  },
  data: () => ({
    SOURCE_TYPE_NULL,
    SOURCE_TYPE_REAL,
    SOURCE_TYPE_STATIC,
    SOURCE_TYPE_ALARM,
    SOURCE_TYPE_OVERVIEW
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      return _.cloneDeep(this.activeWidget.config)
    },
    sourceType () {
      return this.config.dataConfig.sourceType || SOURCE_TYPE_NULL
    },
    code () {
      // 柱形图根据类型调整样式
      const { barType } = this.config.proprietaryConfig
      // const getCode = _.get(this.activeWidget, 'config.dataConfig.staticDataConfig.getCode')
      let code
      try {
        code = this.activeWidget.config.dataConfig.staticDataConfig.getCode(barType)
      } catch (e) {
        code = null
      }
      return code
      // return getCode ? this.config.dataConfig.staticDataConfig.getCode(barType) : null
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
        switch (this.config.type) {
          case 'Lines':
            Object.assign(
              this.config.dataConfig.staticDataConfig,
              { staticData: JSON.parse(code) }
            )
            break
          case 'Pie':
            Object.assign(
              this.config.dataConfig.staticDataConfig,
              { staticData: JSON.parse(code) }
            )
            break
          case 'Polar':
            Object.assign(
              this.config.dataConfig.staticDataConfig,
              { staticData: JSON.parse(code) }
            )
            break
          case 'Bar':
            const { barType } = this.config.proprietaryConfig
            const typeMapping = new Map([
              ['single', 'singleSeries'],
              ['multiple', 'multipleSeries']
            ])
            Object.assign(
              this.config.dataConfig.staticDataConfig.staticData,
              Object.assign(_.omit(JSON.parse(code), ['series'])),
              {
                [typeMapping.get(barType)]: JSON.parse(code).series
              }
            )
            break
          case 'Gauge':
            Object.assign(
              this.config.dataConfig.staticDataConfig,
              { staticData: JSON.parse(code) }
            )
            break
          case 'DegreeRing':
            Object.assign(
              this.config.dataConfig.staticDataConfig,
              { staticData: JSON.parse(code) }
            )
            break
          case 'TextHealth':
            Object.assign(
              this.config.dataConfig.staticDataConfig,
              { staticData: JSON.parse(code) }
            )
            break
          default:
            break
        }
        this.change()
      }
    },
    change () {
      const activeWidget = _.cloneDeep(this.activeWidget)
      const { render } = this.activeWidget
      Object.assign(activeWidget.config, this.config)
      this.activateWidget({
        widget: Object.assign(activeWidget, { config: this.config })
      })
      render.mergeOption(this.config)
    },
    getSlot (slot) {
      return this.$slots[slot] && !_.isEmpty(this.$slots[slot])
    }
  }
}
</script>

<style lang="less">
.data-source {

  &__select {
    width: 100%;
  }

  &__wrap {
    height: calc(100vh - 388px);
    overflow-y: auto;
  }

  &__editor {
    border-radius: 4px;
    background: #f1f1f1;
    font-size: 14px;
  }
}
</style>
