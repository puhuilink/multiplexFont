<template>
  <a-form-item
    label="显示宽度"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'width',
        {
          initialValue: 0
        }
      ]"
      v-bind="formChildProps"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Width'
}
</script>

<style lang="less">

</style>
