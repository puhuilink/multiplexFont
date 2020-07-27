<template>
  <a-form-item
    label="名称"
    v-bind="formItemProps"
  >
    <a-input
      v-decorator="[
        'name',
        {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '名称必填'
            },{
              max: 20,
              message: '最多输入20个字符'
            }
          ]
        },
      ]"
      v-bind="formChildProps"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'Name'
}
</script>

<style lang="less">

</style>
