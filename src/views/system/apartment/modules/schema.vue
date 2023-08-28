<template>
  <a-modal
    :afterClose="reset"
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    :width="550"
    v-model="visible"
    wrapClassName="AlarmPopupDetail__modal"
    @cancel="onCancel"
    destroyOnClose
    @ok="submit">
    <a-form-model ref="ruleForm" :model="formModel">
      <a-form-model-item
        label="上级部门"
        v-bind="formItemLayout"
        prop="apartmentId"
        :rules="[{ required: true, message: '请选择上级部门' }]"
      >
        <a-tree-select
          v-model="formModel.apartmentId"
          placeholder="选择上级部门"
          allow-clear
          :treeData="treeData"
          treeDefaultExpandAll
          :maxTagCount="10"
          :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
        >

        </a-tree-select>
      </a-form-model-item>

      <a-form-model-item
        label="部门名称"
        v-bind="formItemLayout"
        prop="name"
        :rules="[{ required: true, message: '请输入部门名称' }]"
      >
        <a-input v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item
        v-bind="{
          labelCol: { span: 4, offset: 0 },
          wrapperCol: { span: 16, offset: 1 }
        }"
        label="是否启用"
        class="AlarmStrategy__modal-footer-left"
      >
        <a-select
          class="enabled"
          :style="{ width: '100px' }"
          :value="~~formModel.enabled"
          @select="formModel.enabled = !!$event"
        >
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>

      <!--      <a-row :gutter="[5, 8]" type="flex" align="middle">-->
      <!--        <a-col :span="4">-->
      <!--          <a-form-model-item-->
      <!--            label="部门名称"-->
      <!--            v-bind="{-->
      <!--              labelCol: { span: 20, offset: 4 },-->
      <!--              wrapperCol: { span: 0 },-->
      <!--            }"-->
      <!--            :rules="[{ required: true, message: '请填写部门名称' }]"-->
      <!--          >-->
      <!--          </a-form-model-item>-->
      <!--        </a-col>-->

      <!--        <a-col :span="5" :offset="1">-->
      <!--        </a-col>-->

      <!--        <a-col :span="4" :offset="1">-->
      <!--          <a-form-model-item-->
      <!--            label="显示排序"-->
      <!--            v-bind="{-->
      <!--              labelCol: { span: 20, offset: 4 },-->
      <!--              wrapperCol: { span: 0 },-->
      <!--            }"-->
      <!--            :rules="[{ required: true, message: '请填写部门名称' }]"-->
      <!--          >-->
      <!--          </a-form-model-item>-->
      <!--        </a-col>-->

      <!--        <a-col :span="5" :offset="1">-->
      <!--          <a-form-model-item-->
      <!--            v-bind="{-->
      <!--              labelCol: { span: 10, offset: 14 },-->
      <!--            }"-->
      <!--            :rules="[{ required: true, message: '请输入显示排序' }]"-->
      <!--            prop="order"-->
      <!--          >-->
      <!--            <a-input-number :min="0" v-model="formModel.order"></a-input-number>-->
      <!--          </a-form-model-item>-->
      <!--        </a-col>-->
      <!--      </a-row>-->

      <!--      <a-form-model-item-->
      <!--        label="负责人"-->
      <!--        v-bind="{-->
      <!--          labelCol: { span: 4 },-->
      <!--          wrapperCol: { span: 6, offset: 1 },-->
      <!--        }"-->
      <!--        prop="leader"-->
      <!--      >-->
      <!--        <a-select-->
      <!--          v-model="formModel.leaderId"-->
      <!--          placeholder="选择负责人"-->
      <!--          allow-clear-->
      <!--        >-->
      <!--          <a-select-option :key="item.id" v-for="item in userList" :value="item.id">{{ item.staffName }}</a-select-option>-->
      <!--        </a-select>-->
      <!--      </a-form-model-item>-->
    </a-form-model>
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button @click="onSubmit" :loading="submitLoading" type="primary">{{ isEdit ? '提交' : '确定' }}</a-button>
    </template>

  </a-modal>
</template>

<script>

import Schema from '~~~/Mixins/Modal/Schema'
import { STRATEGY_MODE } from '@/tables/cmdb_strategy/enum'
import _ from 'lodash'
import { axios } from '@/utils/request'

export default {
  name: 'Schema',
  mixins: [Schema],
  props: {
    mode: {
      type: String,
      default: STRATEGY_MODE.personal
    },
    apartmentId: {
      type: String,
      default: ''
    },
    treeData: {
      type: Array,
      default: () => [
        {
          value: '1',
          label: '集团',
          disabled: true,
          children: [
            {
              value: '2',
              label: '测试单位',
              parentId: '1'
            }
          ]
        }
      ]
    },
    userList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      formModel: {
        enabled: 1,
        apartmentId: ''
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16, offset: 1 }
      }
    }
  },
  methods: {
    add (text = null) {
      this.isEdit = false
      this.show('添加部门')
      this.formModel.apartmentId = text
    },
    onSubmit () {
      this.$refs.ruleForm.validate(validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        try {
          this.submitLoading = true
          axios.post('/organize/save', {
            name: this.formModel.name,
            parentId: this.formModel.apartmentId,
            isOpen: !!this.formModel.enabled,
            leaderId: this.formModel.leader,
            ...this.isEdit ? { id: this.formModel.id } : {}
          })
          if (this.isEdit) {
            this.$notifyEditSuccess()
          } else {
            this.$notifyAddSuccess()
          }
          this.$emit('operateSuccess')
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    },
    edit (user) {
      this.show('编辑部门')
      this.isEdit = true
      this.formModel = {
        name: user.name,
        apartmentId: user.parentId,
        enabled: user.isOpen,
        leaderId: user.leaderId,
        id: user.id
      }
    },
    // 递归函数，用于遍历树形结构数组并找出所有节点值的最大值
    findMaxValueInTreeArray (treeArray) {
      let maxValue = -1 // 初始化为负无穷大
      for (const node of treeArray) {
        if (node.sortIndex > maxValue) {
          maxValue = node.sortIndex
        }
        if (node.children && node.children.length > 0) {
          const childMaxValue = this.findMaxValueInTreeArray(node.children)
          if (childMaxValue > maxValue) {
            maxValue = childMaxValue
          }
        }
      }
      return maxValue + 1
    },
    onCancel () {
      this.visible = false
    }
  },
  computed: {
    minOrder: function () {
      return this.findMaxValueInTreeArray(this.treeData)
    }
  }
}
</script>

<style scoped>

</style>
