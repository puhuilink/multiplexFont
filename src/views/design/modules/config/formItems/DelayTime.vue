<template>
  <a-form-item label="延迟时间">
    <a-input
      :min="0"
      :parser="parserInt"
      suffix="毫秒"
      type="number"
      v-model.number="config.dataConfig.getCurrentConfig().delayTime"
      @input="$emit('change')"
    />
  </a-form-item>
</template>

<script>
import { parserInt } from '@/utils/util'
import CacheMixin from '../cache'

export default {
  name: 'DelayTime',
  mixins: [CacheMixin],
  methods: {
    parserInt
  }
}
</script>

<style lang="less">

</style>
