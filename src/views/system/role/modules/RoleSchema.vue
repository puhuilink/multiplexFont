<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <div v-if="current===0">
        <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="角色名称" prop="role_name">
            <a-input v-model="form.role_name"/>
          </a-form-model-item>
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="form.remark" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="current===1">
        <a-form-model ref="dataForm" :rules="dataRules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="选择菜单权限" prop="role_name">
            <AuthMenu :record="null" ref="menu" />
          </a-form-model-item>
          <a-form-model-item label="选择移动端角色" prop="role_mobile">
            <a-radio-group v-model="form.role_mobile" @change="onChange" default-value="1">
              <a-radio :value="1">
                无
              </a-radio>
              <a-radio :value="2">
                运维角色
              </a-radio>
              <a-radio :value="3">
                监控角色
              </a-radio>
              <a-radio :value="4">
                管理角色
              </a-radio>
              <a-radio :value="4">
                超级管理员
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>

      </div>
      <div v-if="current===2">
        <a-form-model ref="dataForm" :rules="dataRules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="权限范围" prop="role_name">
            <a-select v-model="form.dataType" default-value="ALL">
              <a-select-option :value="'ALL'">
                全部数据权限
              </a-select-option>
              <a-select-option :value="'CUSTOM'">
                指定部门数据权限
              </a-select-option>
              <a-select-option :value="'DEPT'">
                本部门数据权限
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">
        下一步
      </a-button>
      <a-button
        v-if="current === steps.length - 1"
        type="primary"
        @click="$message.success('Processing complete!')"
      >
        完成
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
        上一步
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import { UserService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'

export default {
  name: 'RoleSchema',
  mixins: [Schema],
  components: { AuthMenu },
  props: {},
  data: (vm) => ({
    current: 0,
    confirmLoading: false,
    steps: [
      { title: '填写基本信息' },
      { title: '配置菜单权限' },
      { title: '配置数据权限' }
    ],
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    rules: {
      role_name: [
        { required: true, message: '角色名称必填', trigger: 'blur' }
      ]
    },
    form: {
      role_name: '',
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    },
    options: {
      flag: [
        {
          name: '有效',
          value: '1'
        },
        {
          name: '无效',
          value: '0'
        }
      ]
    },
    record: null,
    submit: () => {}
  }),
  computed: {},
  methods: {
    // 步骤条向下逻辑
    next () {
      if (this.current === 2) {
        return
      }
      this.current++
    },
    // 步骤条向上逻辑
    prev () {
      if (this.current === 0) {
        return
      }
      this.current--
    },
    /**
     * 打开新增窗口
     */
    add () {
      this.submit = this.insert
      this.show('新增')
    },
    /**
     * 打开编辑窗口
     */
    async edit (record) {
      this.record = { ...record }
      this.submit = this.update
      this.show('编辑')
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(_.pick(record, keys))
    },
    /**
     * 调取新增接口
     */
    async insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await UserService.add(values)
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 调取编辑接口
     */
    async update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          const { user_id } = this.record
          await UserService.update(values, { user_id })
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less">
.steps-content{
  height: 500px;
}
</style>
