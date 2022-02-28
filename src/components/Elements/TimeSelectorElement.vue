<template>
  <div :style="{ width: '100%', height: '100%' }">
    <a-select v-model="timeType" style="width: 120px" @change="handleChange">
      <a-select-option value="hour">一小时</a-select-option>
      <a-select-option value="day">一天</a-select-option>
      <a-select-option value="week">一周</a-select-option>
      <a-select-option value="month">一月</a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'TimeSelectorElement',
  methods: {
    handleChange (value) {
      this.$emit('timeChange', value)
    }
  },
  data () {
    return {
      // styleConfig: new UpsProprietaryConfig({}),
      elementProps: {
        styleConfig: {
          timeType: ''
        }
      },
      timeType: ''
    }
  },
  watch: {
    'elementProps.styleConfig.timeType': {
      immediate: true,
      async handler (value) {
        this.timeType = null
        await this.$nextTick()
        this.timeType = value
      }
    }
  }
}
</script>

<style scoped>

</style>
