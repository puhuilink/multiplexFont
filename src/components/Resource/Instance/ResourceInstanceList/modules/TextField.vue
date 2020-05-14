<template>
  <a-form-item
    :labelCol="{ span: 8 }"
    :wrapperCol="{ span: 12, offset: 4 }"
    :label="label"
    :bind="formItemProps"
    style="width: 100%"
  >
    <a-input
      v-if="dataType === 'STRING'"
      allowClear
      v-model.trim="field.value"
    />
    <a-input-number
      v-else
      allowClear
      v-model.number="field.value"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'TextField',
  mixins: [mixin],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
