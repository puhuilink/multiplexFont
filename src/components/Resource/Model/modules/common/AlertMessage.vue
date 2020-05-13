<template>
  <a-form-item
    label="提示信息"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'alertmessage',
        {
          initialValue: '',
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
  name: 'Alertmessage'
}
</script>

<style lang="less">

</style>
