<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :footer="null"
    :title="title"
    v-model="visible"
    :width="940"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="操作帐号"
            v-bind="formItemLayout"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'user_id',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="客户端IP"
            v-bind="formItemLayout"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'client_ip',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="模块名称"
            v-bind="formItemLayout"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'module_name',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="功能名称"
            v-bind="formItemLayout"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'actionname',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="操作时间"
            v-bind="formItemLayout"
          >
            <a-input
              readOnly
              disabled
              v-decorator="[
                'operation_time',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="操作内容"
            v-bind="formItemLayout"
          >
            <a-textarea
              readOnly
              disabled
              v-decorator="[
                'content',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'AuditSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({}),
  computed: {},
  methods: {
    async detail (record) {
      this.show('审计详情')
      if (record.operation_time) {
        moment(record.operation_time).format('YYYY-MM-DD HH:mm:ss')
      }
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(_.pick(record, keys))
    }
  }
}
</script>

<style lang="less">

</style>
