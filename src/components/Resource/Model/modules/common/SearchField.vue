<template>
  <a-form-item
    label="是否作为查询框"
    v-bind="formItemProps"
  >
    <a-checkbox
      v-decorator="[
        'searchField',
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
  name: 'SearchField'
}
</script>

<style lang="less">

</style>
