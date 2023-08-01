<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-if="visible"
    v-model="visible"
    :width="940"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    @colse="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-form-model
      v-if="title==='编辑菜单权限'"
      ref="menuForm"
      :rules="dataRules"
      :model="record"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item label="选择菜单权限">
        <AuthMenu :record="{data:record.menuCodes}" :menus.sync="menus" :is-role="true" ref="menu" @menuChange="updateMenuData" />
      </a-form-model-item>
      <a-form-model-item label="选择移动端角色" prop="role_mobile">
        <a-radio-group v-model="record.appCode" default-value="1">
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
    <a-form-model
      v-else
      ref="dataForm"
      :rules="dataRules"
      :model="record"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item label="权限范围" prop="data_type">
        <a-select v-model="record.dataType" default-value="ALL">
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
      <a-form-model-item label="请选择部门范围" v-if="record.dataType === 'CUSTOM'">
        <a-tree
          checkable
          :selectable="false"
          defaultExpandAll
          :autoExpandParent="true"
          v-model="record.dataIds"
          :treeData="Depts">
        </a-tree>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { RoleService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'
import { axios } from '@/utils/request'

export default {
  name: 'RoleSingleSchema',
  mixins: [Schema],
  components: { AuthMenu },
  props: {},
  data: (vm) => ({
    confirmLoading: false,
    dataRules: {
      dataType: [
        { required: true, message: '数据权限必选！', trigger: 'blur' }
      ]
    },
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    Depts: [

    ],
    menus: [],
    record: null,
    submit: () => {}
  }),
  computed: {},
  async mounted () {
    await this.getData()
    await this.getMenu()
  },
  methods: {
    cancel () {
      this.visible = false
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
          const children = this.buildDeptsTree(data, item.id)
          if (children.length > 0) {
            item.children = children.map(el => {
              return {
                ...el,
                title: el.name,
                key: el.id
              }
            })
          }
          tree.push({
            ...item,
            title: item.name,
            key: item.id,
            ...dataIds.includes(item.id) ? { disableCheckbox: true } : {}
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
        console.log(fList)
        console.log(mList)
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
          console.log(children)
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
    /**
     * 更新menuCodes
     */
    updateMenuData (keys) {
      this.record.menuCodes = keys
    },
    /**
     * 打开菜单权限窗口
     */
    async updateMenu (record) {
      this.record = { ...record }
      this.show('编辑菜单权限')
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(_.pick(record, keys))
      this.submit = this.insert
    },
    /**
     * 打开数据权限窗口
     */
    async updateData (record) {
      this.record = { ...record }
      this.submit = this.update
      this.show('编辑数据权限')
      await this.getData()
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(_.pick(record, keys))
    },
    /**
     * 调取新增接口
     */
    async insert () {
      const operateType = 'MENU'
      Object.assign(this.record, { operateType })
      try {
        this.confirmLoading = true
        await RoleService.update(this.record)
        this.$emit('editSuccess')
        this.$notifyEditSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.confirmLoading = false
      }
    },
    /**
     * 调取编辑接口
     */
    async update () {
      const operateType = 'DATA'
      Object.assign(this.record, { operateType })
      if (this.record.dataIds.checked) {
        this.record.dataIds = this.record.dataIds.checked
      }
      try {
        this.confirmLoading = true
        await RoleService.update(this.record)
        this.$emit('editSuccess')
        this.$notifyEditSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.confirmLoading = false
      }
    }
  }
}
</script>

<style lang="less">
</style>
