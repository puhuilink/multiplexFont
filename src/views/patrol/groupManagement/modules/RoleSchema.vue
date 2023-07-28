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

    <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="巡更组名称" prop="name">
            <a-input v-model="form.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="巡更组编号" prop="code">
            <a-input v-model="form.code"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="巡更路径" prop="path">
            <a-select v-model="form.path"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="用户" prop="user">
            <a-select v-model="form.user"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="有效标识" prop="isOpen">
            <a-select v-model="form.isOpen"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="form.remark" type="textarea"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

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
    labelCol: { span: 24 },
    wrapperCol: { span: 20 },
    rules: {
      name: [
        { required: true, message: '巡更组名称必填', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '巡更组编号必填', trigger: 'blur' }
      ],
      path: [
        { required: true, message: '巡更组路径必选', trigger: 'blur' }
      ],
      user: [
        { required: true, message: '巡更组用户必选', trigger: 'blur' }
      ],
      isOpen: [
        { required: true, message: '有效标识必选', trigger: 'blur' }
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
    reset () {
      this.$refs.ruleForm.resetFields()
    },
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
