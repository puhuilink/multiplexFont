<template>
  <a-form-item
    label="非空"
    v-bind="formItemProps"
  >
    <a-checkbox
      v-decorator="[
        'allowNull',
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
  name: 'AllowNull'
}
</script>

<style lang="less">

</style>
