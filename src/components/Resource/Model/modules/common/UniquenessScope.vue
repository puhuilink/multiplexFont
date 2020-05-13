<template>
  <a-form-item
    label="唯一范围"
    v-bind="formItemProps"
  >
    <a-input
      type="number"
      v-decorator="[
        'uniquenessScope',
        {
          rules: [
            {
              max: 20,
              message: '最多输入20个字符'
            }
          ]
        }
      ]"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'UniquenessScope'
}
</script>

<style lang="less">

</style>
