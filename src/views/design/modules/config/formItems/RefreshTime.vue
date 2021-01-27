<template>
  <a-form-item label="刷新时间">
    <a-input
      :min="0"
      :parser="parserInt"
      suffix="分钟"
      type="number"
      v-model.number="config.dataConfig.getCurrentConfig().refreshTime"
      @input="$emit('change')"
    />
  </a-form-item>
</template>

<script>
import { parserInt } from '@/utils/util'
import CacheMixin from '../cache'

export default {
  name: 'RefreshTime',
  mixins: [CacheMixin],
  methods: {
    parserInt
  }
}
</script>

<style lang="less">

</style>
