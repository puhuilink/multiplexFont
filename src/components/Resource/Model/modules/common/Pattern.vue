<template>
  <a-form-item
    label="正则验证"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'pattern'
      ]"
      v-bind="formChildProps"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Pattern'
}
</script>

<style lang="less">

</style>
