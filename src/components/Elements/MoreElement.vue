<template>
  <div :style="{ width: '100%', height: '100%', ...fatherStyle}">
    <h1 @click="openModal" :style="styleConfig.textStyle">
      {{ styleConfig.text }}</h1>
    <a-modal
      width="100%"
      centered
      :visible="visible"
      v-if="visible"
      @ok="closeModal"
      @cancel="closeModal"
      @close="closeModal"
      style="display: flex;align-items: center;justify-content: center;"
    >
      <NewAlarmElement
        style="width: 100%;height: 550px"
        v-if="styleConfig.type === 'alarm'"
        :show.sync="visible"
        :is-components="true"
        :props-data="dataSource"
      />
      <TabElement
        style="width: 90%;height: 50%"
        v-else
        :show.sync="visible"
        :component="true"
        :cols="columns"
        :pd="dataSource"
        :args="args"
      />
    </a-modal>
  </div>
</template>

<script>
// import MoreProprietaryConfig from '@/model/config/proprietaryConfigs/MoreProprietaryConfig'

import _ from 'lodash'
import NewAlarmElement from '~~~/Elements/NewAlarmElement'
import TabElement from '~~~/Elements/TabElement'

export default {
  name: 'MoreElement',
  components: {
    NewAlarmElement,
    TabElement
  },
  data () {
    return {
      // styleConfig: new MoreProprietaryConfig({}),
      elementProps: {
        styleConfig: {
          text: '文本',
          textStyle: {
            fontSize: 18,
            fontWeight: 'normal',
            fontStyle: 'normal'
          },
          // defaultColor = '',
          position: {}
        }
      },
      styleConfig: {
        text: '文本',
        textStyle: {
          fontSize: '18px'
        },
        // defaultColor = '',
        position: {}
      },
      fatherStyle: {},
      columns: [],
      dataSource: [],
      visible: false,
      args: {
        siteId: '',
        type: 'hour',
        cache: ''
      }
    }
  },
  watch: {
    'elementProps.styleConfig': {
      immediate: true,
      deep: true,
      handler (value) {
        this.styleConfig = {
          text: '文本',
          textStyle: {
            fontSize: 24
          },
          // defaultColor = '',
          position: {}
        }
        this.styleConfig = _.cloneDeep(value)
        if (this.styleConfig.textStyle) {
          this.styleConfig.textStyle.fontSize += 'px'
          switch (this.styleConfig.position.mode) {
            case 'center':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
              break
            case 'center_left':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }
              break
            case 'center_right':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }
              break
            case 'top_center':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }
              break
            case 'top_left':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }
              break
            case 'top_right':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-start'
              }
              break
            case 'bottom_center':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }
              break
            case 'bottom_left':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-end'
              }
              break
            case 'bottom_right':
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end'
              }
              break
            default:
              this.fatherStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
          }
        }
      }
    },
    'elementProps.columns': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.columns = value
        }
      }
    },
    'elementProps.dataSource': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.dataSource = value
        }
      }
    },
    'elementProps.siteId': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.args.siteId = value
        }
      }
    },
    'elementProps.type': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.args.type = value
        }
      }
    },
    'elementProps.cache': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.args.cache = value
        }
      }
    },
    'elementProps.size': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.args.size = value
        }
      }
    }
  },
  methods: {
    openModal () {
      this.visible = true
    },
    closeModal () {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.list-element {
  height: 100%;
  overflow: hidden;

.ant-table td { white-space: nowrap; }

.ant-table-thead > tr > th {
  color:inherit !important;
  font-weight: inherit !important;
  background-color: inherit !important;
}

.ant-table-header {
  background-color: transparent;
  overflow: hidden !important;
}

.ant-table-scroll {
.ant-table-body {
// 隐藏右侧滚动条
width: 100%;
    }
  }
}
</style>
