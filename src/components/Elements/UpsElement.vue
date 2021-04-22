<template>
  <div :style="{ width: '100%', height: '100%' }">
    <iframe
      :src="addr"
      frameborder="0"
      height="100%"
      width="100%"
      ref="iframe"
      v-if="addr" />
  </div>
</template>

<script>
export default {
  name: 'UpsElement',
  data () {
    return {
      // styleConfig: new UpsProprietaryConfig({}),
      elementProps: {
        styleConfig: {
          addr: ''
        }
      },
      addr: ''
    }
  },
  mounted () {
    console.log('clone', this.elementProps)
  },
  watch: {
    'elementProps.styleConfig.addr': {
      immediate: true,
      async handler (value) {
        this.addr = null
        await this.$nextTick()
        this.addr = value
      }
    }
  }
}
</script>

<style scoped>

</style>
