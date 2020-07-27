<template>
  <a-form-item
    label="排序"
    v-bind="formItemProps"
  >
    <a-input
      type="number"
      v-decorator="[
        'order',
        {
          initialValue: 0
        }
      ]"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Order'
}
</script>

<style lang="less">

</style>
