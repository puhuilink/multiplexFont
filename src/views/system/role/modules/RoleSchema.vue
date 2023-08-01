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
            <AuthMenu :record="{data:menuForm.menuCodes}" :menus.sync="menus" :is-role="true" ref="menu" @menuChange="logSth"/>
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
          </a-form-model-item>
          <a-form-model-item label="请选择部门范围" prop="dataType" v-if="dataForm.dataType === 'CUSTOM'">
            <a-tree
              checkable
              defaultExpandAll
              :selectable="false"
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
import { RoleService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'
import { dataFilter } from 'echarts/lib/component/marker/markerHelper'
import { axios } from '@/utils/request'

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
      operateType: 'ADD'
    },
    menuForm: {
      appCode: 'none',
      menuCodes: []
    },
    dataForm: {
      dataType: 'ALL',
      dataIds: []
    },
    Depts: [],
    menus: [],
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
    async initTreeData () {
      await this.getData()
      await this.getMenu()
    },
    async getData (params = { isOpen: true, orgName: '' }) {
      try {
        const { data: { list, dataIds } } = await axios.get(`/organize/list?isOpen=${params.isOpen}${params.orgName === '' ? '' : '&orgName=' + params.orgName}`)
        this.Depts = this.buildDeptsTree(list.map(el => {
          if (el.parentId === undefined) {
            el.parentId = null
          }
          return el
        }), null, dataIds)
      } catch (e) {
        throw e
      }
    },
    buildDeptsTree (data, parentId = null, dataIds) {
      const tree = []
      for (const item of data) {
        if (item.parentId === parentId) {
          const children = this.buildDeptsTree(data, item.id, dataIds)
          if (children.length > 0) {
            item.children = children.map(el => {
              return {
                ...el,
                title: el.name,
                key: el.id,
                ...dataIds.indexOf(item.id) ? {} : { disableCheckbox: true }
              }
            })
          }
          tree.push({
            ...item,
            title: item.name,
            key: item.id,
            ...dataIds.indexOf(item.id) ? {} : { disableCheckbox: true }
          })
        }
      }
      return tree
    },
    async getMenu () {
      try {
        const result = await RoleService.findMenu()
        const fList = result.map(el => {
          if (el.parent_code === 'NULL') {
            el.parent_code = null
          }
          if (el.menu_type === '1') {
            return el
          }
        }).filter((f) => f)
        const mList = result.map(el => {
          if (el.parent_code === 'NULL') {
            el.parent_code = null
          }
          if (el.menu_type === '2') {
            return el
          }
        }).filter((f) => f)
        const FF = this.buildTree(fList)
        const MM = this.buildTree(mList)
        this.menus = [...FF, ...MM]
      } catch (e) {
        throw e
      }
    },
    buildTree (data, parentId = null) {
      const tree = []
      data.forEach((item) => {
        if (!item) {
          return
        }
        if (item.parent_code === parentId) {
          const children = this.buildTree(data, item.code)
          if (children.length > 0) {
            item.children = children
          }
          tree.push({
            ...item,
            title: item.name,
            key: item.code
          })
        }
      })
      return tree
    },
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
      this.initTreeData()
    },
    /**
     * 打开编辑窗口
     */
    async edit (record) {
      const { name, remark, appCode, menuCodes, dataType, dataIds, id } = record
      this.dataForm = { dataType, dataIds }
      this.menuForm = { appCode, menuCodes }
      this.originalForm = { id, name, remark, operateType: 'EDIT' }
      this.submit = this.update
      this.show('编辑')
      await this.initTreeData()
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(_.pick(record, keys))
    },
    /**
     * 调取新增接口
     */
    async insert () {
      if (this.dataForm.dataIds.checked) {
        this.dataForm.dataIds = this.record.dataIds.checked
      }
      const ob = {}
      Object.assign(ob, this.dataForm, this.menuForm, this.originalForm)
      this.$refs.dataForm.validate(async (err) => {
        if (!err) return
        try {
          this.confirmLoading = true
          await RoleService.update(ob)
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.$message.error(e)
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
      if (this.dataForm.dataIds.checked) {
        this.dataForm.dataIds = this.record.dataIds.checked
      }
      const ob = {}
      Object.assign(ob, this.dataForm, this.menuForm, this.originalForm)
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await RoleService.update(ob)
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$message.error(e)
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
