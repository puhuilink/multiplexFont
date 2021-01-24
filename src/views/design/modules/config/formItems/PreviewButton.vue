<template>
  <a-form-item>
    <a-button
      :disabled="!config.dataConfig.getCurrentConfig().isAvailable"
      :loading="previewButtonLoading"
      @click="onClick"
      v-bind="$props"
      v-on="$listeners"
    >预览</a-button>
  </a-form-item>
</template>

<script>
import { Button } from 'ant-design-vue'
import CacheMixin from '../cache'

export default {
  name: 'PreviewButton',
  extends: Button,
  mixins: [CacheMixin],
  props: {
    validate: {
      type: Function,
      default: () => true
    },
    preview: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      previewButtonLoading: false
    }
  },
  methods: {
    async onClick () {
      try {
        this.previewButtonLoading = true
        if (await this.validate()) {
          await this.preview()
        }
      } finally {
        this.previewButtonLoading = false
      }
    }
  }
}
</script>

<style lang="less">

</style>
