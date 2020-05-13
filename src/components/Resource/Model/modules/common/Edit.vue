<template>
  <a-form-item
    label="不可编辑"
    v-bind="formItemProps"

  >
    <a-checkbox
      v-decorator="[
        'edit_b',
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
  name: 'Edit'
}
</script>

<style lang="less">

</style>
