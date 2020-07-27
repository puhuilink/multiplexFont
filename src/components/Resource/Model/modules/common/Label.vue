<template>
  <a-form-item
    label="显示名称"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'label',
        { rules: [
          {
            required: true,
            message: '显示名称必填'
          },
          {
            max: 20,
            message: '最多输入20个字符'
          }
        ]
        },
      ]"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Label'
}
</script>

<style lang="less">

</style>
