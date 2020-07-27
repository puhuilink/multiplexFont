<template>
  <a-form-item
    label="正则验证"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'pattern',
        {
          initialValue: '',
          rules: [
            {
              max: 20,
              message: '最多输入20个字符'
            }
          ]
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
  name: 'Pattern'
}
</script>

<style lang="less">

</style>
