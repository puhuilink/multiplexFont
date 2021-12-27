<template>
  <div :style="{ width: '100%', height: '100%', ...fatherStyle}">
    <h1 @click="openModal" :style="styleConfig.textStyle">
      {{ styleConfig.text }}</h1>
    <a-modal
      :visible="visible"
      v-if="visible"
      @ok="closeModal"
      @cancel="closeModal"
      @close="closeModal"
    >
      <a-table :columns="columns" :dataSource="dataSource"></a-table>
    </a-modal>
  </div>
</template>

<script>
// import MoreProprietaryConfig from '@/model/config/proprietaryConfigs/MoreProprietaryConfig'

import _ from 'lodash'

export default {
  name: 'MoreElement',
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
      visible: false
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

<style scoped>

</style>
