<template>
  <a-form-item
    :label="field.label"
    v-bind="formItemProps"
    style="width: 100%"
  >
    <a-date-picker
      :format="showTime ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD'"
      :valueFormat="showTime ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD'"
      style="width: 100%"
      :placeholder="showTime ? '请选择时间' : '请选择日期'"
      :showTime="showTime"
      v-bind="formChildProps"
      v-model="field.value"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'DateField',
  mixins: [mixin],
  components: {},
  props: {
    showTime: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
  }),
  methods: {}
}
</script>

<style lang="less">

</style>
