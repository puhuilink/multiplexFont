<template>
  <a-form-item label="延迟时间">
    <a-input
      :min="0"
      :parser="parserInt"
      suffix="分钟"
      type="number"
      v-model.number="activeWidget.config.dataConfig.getCurrentConfig().delayTime"
      @input="$emit('change')"
    />
  </a-form-item>
</template>

<script>
import { parserInt } from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'DelayTime',
  computed: {
    ...mapState('screen', ['activeWidget'])
  },
  methods: {
    parserInt
  }
}
</script>

<style lang="less">

</style>
