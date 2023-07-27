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
    <a-form-model
      v-if="title==='编辑菜单权限'"
      ref="dataForm"
      :rules="dataRules"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item label="选择菜单权限">
        <AuthMenu :record="{data:form.menuCodes}" :is-role="true" ref="menu" />
      </a-form-model-item>
      <a-form-model-item label="选择移动端角色" prop="role_mobile">
        <a-radio-group v-model="form.appCode" default-value="1">
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
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item label="权限范围" prop="data_type">
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
        <a-tree
          v-if="form.dataType === 'CUSTOM'"
          checkable
          defaultExpandAll
          :checkStrictly="true"
          :autoExpandParent="true"
          v-model="form.dataIds"
          :treeData="Depts">
        </a-tree>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { UserService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'

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
    Depts: [

    ],
    record: null,
    submit: () => {}
  }),
  computed: {},
  methods: {
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
</style>
