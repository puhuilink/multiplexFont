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
    :footer="null"
  >
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <div v-if="current===0">
        <a-form-model ref="ruleForm" :rules="rules" :model="originalForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="角色名称" prop="name">
            <a-input v-model="originalForm.name"/>
          </a-form-model-item>
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="originalForm.remark" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="current===1">
        <a-form-model ref="dataForm" :rules="dataRules" :model="menuForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="选择菜单权限">
            <AuthMenu :record="{data:menuForm.menuCodes}" :is-role="true" ref="menu" @menuChange="logSth"/>
          </a-form-model-item>
          <a-form-model-item label="选择移动端角色" prop="role_mobile">
            <a-radio-group v-model="menuForm.appCode" :default-value="'none'">
              <a-radio :value="'none'">
                无
              </a-radio>
              <a-radio :value="'patrol'">
                运维角色
              </a-radio>
              <a-radio :value="'monitor'">
                监控角色
              </a-radio>
              <a-radio :value="'manager'">
                管理角色
              </a-radio>
              <a-radio :value="'admin'">
                超级管理员
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>

      </div>
      <div v-if="current===2">
        <a-form-model ref="dataForm" :rules="dataRules" :model="dataForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="权限范围" prop="dataType">
            <a-select v-model="dataForm.dataType" :default-value="'ALL'">
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
            <a-tree
              v-if="dataForm.dataType === 'CUSTOM'"
              checkable
              defaultExpandAll
              :checkStrictly="true"
              :autoExpandParent="true"
              v-model="dataForm.dataIds"
              :treeData="Depts">
            </a-tree>
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
        @click="submit"
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
import { dataFilter } from 'echarts/lib/component/marker/markerHelper'

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
      name: [
        { required: true, message: '角色名称必填', trigger: 'blur' }
      ]
    },
    dataRules: {
      dataType: [
        { required: true, message: '数据权限必选！', trigger: 'blur' }
      ]
    },
    originalForm: {
      name: '',
      remark: '',
      operateType: ''
    },
    menuForm: {
      appCode: 'none',
      menuCodes: []
    },
    dataForm: {
      dataType: 'ALL',
      dataIds: []
    },
    Depts: [{
      childs: [],
      code: 'F002',
      createDate: null,
      creator: '',
      functionType: '5',
      icon: '',
      module: '',
      name: '视图管理',
      note: '',
      order: 1,
      parentCode: 'F',
      updateDate: null,
      updator: '',
      key: 'F002',
      children: [
        {
          childs: [],
          code: 'F002001',
          createDate: null,
          creator: '',
          functionType: '5',
          icon: '',
          module: '',
          name: '视图展示（缩略图模式）',
          note: '',
          order: 1,
          parentCode: 'F002',
          updateDate: null,
          updator: '',
          key: 'F002001',
          title: '视图展示（缩略图模式）'
        },
        {
          childs: [],
          code: 'F002003',
          createDate: null,
          creator: '',
          functionType: '5',
          icon: '',
          module: '',
          name: '视图展示（页签模式）',
          note: '',
          order: 2,
          parentCode: 'F002',
          updateDate: null,
          updator: '',
          key: 'F002003',
          title: '视图展示（页签模式）'
        }
      ],
      title: '视图管理'
    }],
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
    dataFilter,
    logSth (el) {
      this.menuForm.menuCodes = [...el]
    },
    // 步骤条向下逻辑
    next () {
      if (this.current === 2) {
        return
      }
      if (this.current === 0) {
        this.$refs.ruleForm.validateField('name', (valid) => {
          if (valid) {
            this.current = -1
          } else {
            this.$refs.ruleForm.clearValidate('name')
          }
        })
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
