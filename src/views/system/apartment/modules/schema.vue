<template>
  <a-modal
    :afterClose="reset"
    cancelText="取消"
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    :width="700"
    v-model="visible"
    wrapClassName="AlarmPopupDetail__modal"
    @cancel="cancel"
    @ok="submit">
    <a-form-model ref="ruleForm" :model="formModel">
      <a-form-model-item
        label="上级部门"
        v-bind="formItemLayout"
        prop="name"
        v-if="mode === 'personal'"
        :rules="[{ required: true, message: '请选择上级部门' }]"
      >
        <a-input :disabled="isDetail" v-model.trim="formModel.name" />
      </a-form-model-item>

      <a-row :gutter="[5, 8]" type="flex" align="middle">
        <a-col :span="4">
          <a-form-model-item
            label="部门名称"
            v-bind="{
              labelCol: { span: 20, offset: 4 },
              wrapperCol: { span: 0 },
            }"
            :rules="[{ required: true, message: '请填写部门名称' }]"
          >
          </a-form-model-item>
        </a-col>

        <a-col :span="5" :offset="1">
          <a-form-model-item
            v-bind="{
              labelCol: { span: 10, offset: 14 },
            }"
            :rules="[{ required: true, message: '请输入部门名称' }]"
          >
            <a-input :disabled="isDetail"/>
          </a-form-model-item>
        </a-col>

        <a-col :span="4" :offset="1">
          <a-form-model-item
            label="显示排序"
            v-bind="{
              labelCol: { span: 20, offset: 4 },
              wrapperCol: { span: 0 },
            }"
            :rules="[{ required: true, message: '请填写部门名称' }]"
          >
          </a-form-model-item>
        </a-col>

        <a-col :span="5" :offset="1">
          <a-form-model-item
            v-bind="{
              labelCol: { span: 10, offset: 14 },
            }"
            :rules="[{ required: true, message: '请输入显示排序' }]"
          >
            <a-input :disabled="isDetail"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-form-model-item
        label="负责人"
        v-bind="{
          labelCol: { span: 4 },
          wrapperCol: { span: 6, offset: 1 },
        }"
        prop="name"
        v-if="mode === 'personal'"
        :rules="[{ required: true, message: '请选择负责人' }]"
      >
        <a-input :disabled="isDetail" v-model.trim="formModel.name" />
      </a-form-model-item>
    </a-form-model>
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item
        v-bind="{
          labelCol: { span: 4 },
          wrapperCol: { span: 1, offset: 1 },
        }"
        label="启用"
        :style="{
          float: 'left',
          width: '300px',
        }"
        v-if="mode === 'personal'"
        class="AlarmStrategy__modal-footer-left"
      >
        <a-select
          class="enabled"
          :style="{ width: '100px' }"
          :disabled="isDetail"
          :value="~~formModel.enabled"
          v-if="mode === 'personal'"
          @select="formModel.enabled = !!$event"
        >
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">{{ isEdit ? '提交' : '确定' }}</a-button>
    </template>

  </a-modal>
</template>

<script>

import Schema from '~~~/Mixins/Modal/Schema'
import { STRATEGY_MODE } from '@/tables/cmdb_strategy/enum'

export default {
  name: 'Schema',
  mixins: [Schema],
  props: {
    mode: {
      type: String,
      default: STRATEGY_MODE.personal
    }
  },
  data () {
    return {
      isDetail: false,
      submitLoading: false,
      formModel: {
        enabled: 1
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16, offset: 1 }
      }
    }
  },
  methods: {
    add () {
      console.log(123)
      this.show('添加部门')
    },
    edit () {
      this.show('编辑部门')
    }
  }
}
</script>

<style scoped>

</style>
