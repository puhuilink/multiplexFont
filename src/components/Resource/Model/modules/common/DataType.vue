<template>
  <a-form-item
    label="数据类型"
    v-bind="formItemProps"
  >
    <a-select
      v-decorator="[
        'dataType',
        {
          initialValue: 'STRING'
        },
      ]"
    >
      <a-select-option
        v-for="item in options.type"
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
  name: 'DataType',
  data: () => ({
    options: {
      type: [
        {
          name: 'STRING',
          value: 'STRING'
        },
        {
          name: 'INT',
          value: 'INT'
        },
        {
          name: 'DOUBLE',
          value: 'DOUBLE'
        },
        {
          name: 'LONG',
          value: 'LONG'
        },
        {
          name: 'DATE',
          value: 'DATE'
        },
        {
          name: 'BOOLEAN',
          value: 'BOOLEAN'
        },
        {
          name: 'FLOAT',
          value: 'FLOAT'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
