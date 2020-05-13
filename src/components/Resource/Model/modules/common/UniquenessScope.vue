<template>
  <a-form-item
    label="唯一范围"
    v-bind="formItemProps"
  >
    <a-input
      type="number"
      v-decorator="[
        'uniquenessScope',
      ]"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'UniquenessScope'
}
</script>

<style lang="less">

</style>
