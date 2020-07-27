<template>
  <a-form-item
    label="显示类型"
    v-bind="formItemProps"
  >
    <a-select
      v-on="$listeners"
      v-bind="formChildProps"
      v-decorator="[
        'displayType',
        {
          initialValue: 'TEXT',
          rules: [
            {
              required: true,
              message: '显示类型必选'
            }
          ]
        },
      ]"
    >
      <a-select-option
        v-for="item in options.displayType"
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
  name: 'DisplayType',
  data: () => ({
    options: {
      displayType: [
        {
          name: 'TEXT',
          value: 'TEXT'
        },
        {
          name: 'TEXTAREA',
          value: 'TEXTAREA'
        },
        {
          name: 'DATE',
          value: 'DATE'
        },
        {
          name: 'DATETIME',
          value: 'DATETIME'
        },
        {
          name: 'CHECKBOX',
          value: 'CHECKBOX'
        },
        {
          name: 'RADIO',
          value: 'RADIO'
        },
        {
          name: 'SELECTED',
          value: 'SELECTED'
        },
        {
          // TODO: 用途？
          name: 'URMPTREE',
          value: 'URMPTREE'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
