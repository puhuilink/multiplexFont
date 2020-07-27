<template>
  <a-form-item
    label="所属分组"
    v-bind="formItemProps"
  >
    <a-select
      v-decorator="[
        'tabGroup',
        {
          rules: [
            {
              required: true,
              message: '所属分组必填'
            }
          ],
          initialValue: 'base'
        },
      ]"
    >
      <a-select-option
        v-for="item in options.tabGroup"
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
      tabGroup: [
        {
          name: '基本信息',
          value: 'base'
        },
        {
          name: '关系信息',
          value: 'relation'
        },
        {
          name: '其他信息',
          value: 'other'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
