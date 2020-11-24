<template>
  <a-form-model layout="vertical">
    <a-row>
      <a-col
        :md="12"
        :sm="24"
        v-for="({ label, children = [], ...config }, idx) in formItemList"
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
              <component
                :is="child.textarea ? 'a-textarea' : 'a-input' "
                readOnly
                :value="renderText(record, child)"
                :autoSize="{ minRows: 3, maxRows: 6 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-form-model-item v-else v-bind="formItemLayout" :label="label" >
          <component
            :is="config.textarea ? 'a-textarea' : 'a-input' "
            readOnly
            :value="renderText(record, config)"
            :autoSize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-model-item>

      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import _ from 'lodash'

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
  }),
  methods: {
    renderText (record = {}, config = {}) {
      const { key, customRender } = config
      const text = _.get(record, key, '')
      return customRender ? customRender(text, record) : text
    }
  }
}
</script>

<style lang="less">

</style>
