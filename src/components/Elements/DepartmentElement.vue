<template>
  <div :style="{ width: '100%', height: '100%', ...fatherStyle}">
    <h1 class="departmentTitle" :title="styleConfig.text" :style="styleConfig.textStyle" v-show="styleConfig.text">
      ({{ styleConfig.text }})</h1>
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
            width: 50,
            fontStyle: 'normal'
          },
          // defaultColor = '',
          position: {}
        }
      },
      styleConfig: {
        text: '文本',
        textStyle: {
          fontSize: '18px',
          width: 50
        },
        // defaultColor = '',
        position: {}
      },
      fatherStyle: {}
    }
  },
  watch: {
    'elementProps.styleConfig': {
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
          this.styleConfig.textStyle.cursor = 'pointer'
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
    }
  },
  methods: {
  },
  computed: {
  },
  beforeDestroy () {
    this.elementProps = null
  }
}
</script>

<style lang="less" scoped>
.departmentTitle{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
