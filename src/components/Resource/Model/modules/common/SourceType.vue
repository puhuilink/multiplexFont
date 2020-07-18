<template>
  <a-form-item
    label="源类型"
    v-bind="formItemProps"
  >
    <a-select
      v-bind="formChildProps"
      v-decorator="[
        'sourceType',
        {
          initialValue: 'DICT',
        }
      ]"
    >
      <a-select-option
        v-for="item in options.sourcetype"
        :key="item.value"
        :value="item.value"
      >{{ item.name }}</a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'SourceType',
  data: () => ({
    options: {
      // FIXME: 值从哪里来？
      sourcetype: [
        {
          name: 'DICT',
          value: 'DICT'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
