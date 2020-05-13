<template>
  <a-form-item
    label="源值"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'sourceValue',
        {
          initialValue: '',
          rules: [
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
  name: 'SourceValue'
}
</script>

<style lang="less">

</style>
