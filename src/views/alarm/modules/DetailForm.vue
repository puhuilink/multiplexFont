<template>
  <a-form-model layout="vertical">
    <a-row>
      <a-col
        :md="12"
        :sm="24"
        v-for="({ label, key, children = [] }, idx) in formItemList"
        :key="idx"
      >

        <a-row v-if="children.length">
          <a-col
            :md="24 / children.length"
            :sm="24"
            v-for="(child, childIdx) in children"
            :key="childIdx"
          >
            <a-form-model-item v-bind="formItemLayout" :label="child.label">
              <a-input readOnly :value="record[child.key]" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-form-model-item v-else v-bind="formItemLayout" :label="label" >
          <a-input readOnly :value="record[key]" />
        </a-form-model-item>

      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
export default {
  name: 'DetailForm',
  props: {
    record: {
      type: Object,
      default: () => ({})
    },
    formItemList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    formItemLayout: {
      // TODO: responsive
      labelCol: {
        // span: 6
      },
      wrapperCol: {
        span: 23
      }
    }
  })
}
</script>

<style lang="less">

</style>
