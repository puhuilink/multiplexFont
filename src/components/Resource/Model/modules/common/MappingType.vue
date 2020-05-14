<template>
  <a-form-item
    label="映射类型"
    v-bind="formItemProps"
  >
    <a-select
      v-decorator="[
        'mappingType',
        {
          rules: [
            {
              required: true,
              message: '所属分组必填'
            }
          ],
          initialValue: 'one'
        },
      ]"
    >
      <a-select-option
        v-for="item in options.mappingType"
        :key="item.value"
        :value="item.value"
      >{{ item.name }}</a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'Label',
  mixins: [mixin],
  data: () => ({
    options: {
      mappingType: [
        {
          name: 'one',
          value: 'one'
        },
        {
          name: 'more',
          value: 'more'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
