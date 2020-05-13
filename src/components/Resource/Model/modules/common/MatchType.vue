<template>
  <a-form-item
    label="匹配条件"
    v-bind="formItemProps"
  >
    <!-- :disabled="disabledMatchType" -->
    <a-select
      v-decorator="[
        'matchType'
      ]"
    >
      <a-select-option
        v-for="item in options.matchType"
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
      matchType: [
        {
          name: '等于',
          value: 'EQ'
        },
        {
          name: '不等于',
          value: 'NE'
        },
        {
          name: '模糊',
          value: 'LIKE'
        },
        {
          name: '大于',
          value: 'GT'
        },
        {
          name: '小于',
          value: 'LT'
        },
        {
          name: '大于等于',
          value: 'LE'
        },
        {
          name: '小于等于',
          value: 'GE'
        },
        {
          name: '包含',
          value: 'IN'
        },
        {
          name: '不包含',
          value: 'NOT_IN'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
