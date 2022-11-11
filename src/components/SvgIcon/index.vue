<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg
    v-else
    :class="svgClass"
    aria-hidden="true"
    v-on="$listeners"
    :width="width"
    :height="height"
    :style="{ color }">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts">
// 注意svg文件的<svg> 标签上必须有 fill="currentColor" 字段,这样才能从外部的span等标签复制颜色,否则颜色不可变

export default {
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '20px'
    },
    height: {
      type: String,
      default: '20px'
    }
  },
  computed: {
    symbolId () {
      return `#${this.prefix}-${this.name}`
    },
    svgClass () {
      if (this.name) {
        return 'svg-icon ' + this.name
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon () {
      return {
        mask: `url(${this.name}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.name}) no-repeat 50% 50%`
      }
    }
  },
  methods: {
    isExternal (path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    }
  }
}
</script>
