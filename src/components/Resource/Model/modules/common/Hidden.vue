<template>
  <a-form-item
    label="隐藏"
    v-bind="formItemProps"
  >
    <a-checkbox
      v-decorator="[
        'hidden',
        {
          valuePropName: 'checked',
          initialValue: false
        }
      ]"></a-checkbox>
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Hidden'
}
</script>

<style lang="less">

</style>
