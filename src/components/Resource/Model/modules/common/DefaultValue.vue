<template>
  <a-form-item
    label="默认值"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'defaultValue',
        {
          initialValue: ''
        }
      ]"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'DefaultValue'
}
</script>

<style lang="less">

</style>
