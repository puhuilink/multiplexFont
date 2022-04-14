<template>
  <div class="texts-config">
    <a-tabs defaultActiveKey="1" tabPosition="top" :style="{ height: '100%'}">
      <a-tab-pane tab="样式" key="1">
        <!-- S 公共配置模板 -->
        <CommonTemplate :usePadding="false" />
        <!-- E 公共配置模板 -->
      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <div class="circle-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">
            <a-collapse-panel header="样式" key="1">
              <a-form-item title="连线颜色类型">
                <a-radio-group v-model="config.proprietaryConfig.style.isOneColor" @change="change()">
                  <a-radio :value="true">纯色</a-radio>
                  <a-radio :value="false">渐变</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item title="色值">
                <div v-if="config.proprietaryConfig.style.isOneColor">
                  <ColorPicker
                    v-model="config.proprietaryConfig.style.lineOneColor"
                    @change="change"
                  ></ColorPicker>
                </div>
                <div v-else>
                  <ColorPicker
                    v-model="config.proprietaryConfig.style.lineGradColor[0]"
                    @change="change"
                  ></ColorPicker>
                  <ColorPicker
                    v-model="config.proprietaryConfig.style.lineGradColor[1]"
                    @change="change"
                  ></ColorPicker>
                </div>
              </a-form-item>
            </a-collapse-panel>
            <a-collapse-panel header="悬浮列表" key="2">
              <div class="comment-template__item">
                <p class="comment-template__leading">是否显示</p>
                <div class="comment-template__inner comment-template__end">
                  <a-radio-group v-model="config.proprietaryConfig.innerTable.show" @change="change()">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </div>
              </div>
              <div class="comment-template__item" v-if="config.proprietaryConfig.innerTable.show">
                <p class="comment-template__leading">标题</p>
                <div class="comment-template__inner comment-template__end">
                  <a-input v-model="config.proprietaryConfig.innerTable.title" @change="change()">
                  </a-input>
                </div>
              </div>
              <a-form-item label="列定义" v-if="config.proprietaryConfig.innerTable.show">
                <div v-for="(e,index) in config.proprietaryConfig.innerTable.columns" :key="index" style="border: #0098f7 1px">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">列名({{ index }})</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-input v-model="e.title" @change="change()"></a-input>
                    </div>
                  </div>
                  <div class="comment-template__item">
                    <p class="comment-template__leading">数据下标({{ index }})</p>
                    <div class="comment-template__inner comment-template__end">
                      <a-input v-model="e.dataIndex" @change="change()"></a-input>
                    </div>
                  </div>
                  <div style="display: flex;align-content: center;justify-content: center;">
                    <a-button type="danger" @click="deleteColumn(index)"><a-icon type="delete" ></a-icon></a-button>
                  </div>
                </div>
                <div style="display: flex;align-content: center;justify-content: center;">
                  <a-button @click="addColumn"><a-icon type="plus" ></a-icon></a-button>
                </div>
              </a-form-item>
              <div class="comment-template__item" v-if="config.proprietaryConfig.innerTable.show">
                <p class="comment-template__leading">sql语句</p>
                <div class="comment-template__inner comment-template__end">
                  <a-textarea v-model="config.proprietaryConfig.innerTable.sql" :rows="4" @change="change()">
                  </a-textarea>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="数据" key="3">
        <TextHealthDataSource />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../proprietaryMixins'
import ColorPicker from '@/components/ColorPicker'
import TextHealthDataSource from '@/views/design/modules/config/dataSource/TextHealthDataSource'
export default {
  name: 'PercentConfig',
  mixins: [ProprietaryMixins],
  data () {
    return {
    }
  },
  components: {
    CommonTemplate,
    ColorPicker,
    TextHealthDataSource
  },
  methods: {
    addColumn () {
      const { columns } = this.config.proprietaryConfig.innerTable
      columns.push({ title: '', dataIndex: '' })
      this.change()
    },
    deleteColumn (index) {
      const { columns } = this.config.proprietaryConfig.innerTable
      columns.splice(index, 1)
      this.change()
    }
  }
}
</script>

<style scoped lang="less">
.comment-template {
  &__leading {
    flex: none;
    width: 90px;
    margin: 0;
    text-align: left;
  }
}
</style>
