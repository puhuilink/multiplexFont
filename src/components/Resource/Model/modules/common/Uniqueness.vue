<template>
  <a-form-item
    label="唯一验证"
    v-bind="formItemProps"

  >
    <a-checkbox
      v-decorator="[
        'uniqueness',
        {
          initialValue: false,
          valuePropName: 'checked'
        }
      ]"></a-checkbox>
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Uniqueness'
}
</script>

<style lang="less">

</style>
