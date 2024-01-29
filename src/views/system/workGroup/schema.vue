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
        label="工作组名称"
        v-bind="formItemLayout"
        :rules="[{ required: true, message: '请填写部门名称' }]"
      >
        <a-input v-model="formModel.name"></a-input>
      </a-form-model-item>

      <a-form-model-item
        label="用户"
        v-bind="formItemLayout"
        prop="user"
        :rules="[{ required: true, message: '请选择工作组用户' }]"
      >
        <a-select
          placeholder="请选择用户"
          mode="multiple"
          v-model="formModel.user"
          @change="userChange"
          allow-clear>
          <a-select-option v-for="(item, index) in userList" :value="item.id" :key="index">{{ item.userName }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        label="组长"
        v-bind="formItemLayout"
        prop="leader"
        :rules="[{ required: true, message: '请选择工作组组长' }]"
      >
        <a-select
          placeholder="请选择组长"
          v-model="formModel.leader"
          allow-clear>
          <a-select-option v-for="(item, index) in leadList" :value="item.id" :key="index">{{ item.userName }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        v-bind="formItemLayout"
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

      <a-form-model-item label="备注" v-bind="formItemLayout">
        <a-input v-model="formModel.remark" type="textarea" style=" min-height: 120px;"/>
      </a-form-model-item>
    </a-form-model>
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <!--      <a-button @click="onSubmit" :loading="submitLoading" type="primary">{{ isEdit ? '提交' : '确定' }}</a-button>-->
      <a-button @click="onSubmit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

  </a-modal>
</template>

<script>

import Schema from '~~~/Mixins/Modal/Schema'
import { STRATEGY_MODE } from '@/tables/cmdb_strategy/enum'
import { axios, xungeng } from '@/utils/request'
import JSONBig from 'json-bigint'
import { decrypt } from '@/utils/aes'

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
        apartmentId: '',
        user: [],
        leader: '',
        organizeId: ''
      },
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 13, offset: 1 }
      },
      fileList: [],
      rules: {
        orgId: [
          { required: true, message: '部门必填', trigger: 'blur' }
        ],
        floor: [
          { max: 50, message: '楼层必填', trigger: 'blur' }
        ],
        file: [
          { required: true, message: '文件必须上传', trigger: 'change' },
          { validator: this.excelRequire, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    userChange (nl, option) {
      if (nl.indexOf(this.formModel.leader) === -1) {
        this.formModel.leader = ''
      }
    },
    onAdd (text = null) {
      this.isEdit = false
      this.show('添加工作组')
      this.formModel.apartmentId = text
    },
    onSubmit () {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        try {
          const user = this.formModel.user.map(el => {
            return { userId: el, leader: el === this.formModel.leader }
          })
          this.submitLoading = true
          await axios.post('/group/save', {
            group: {
              name: this.formModel.name,
              ...this.formModel.organizeId.length ? { organizeId: this.formModel.organizeId } : {},
              isOpen: !!this.formModel.enabled,
              remark: this.formModel.remark,
              ...this.isEdit ? { id: this.formModel.id } : {}
            },
            users: user
          })
          if (this.isEdit) {
            this.$notifyEditSuccess()
          } else {
            this.$notifyAddSuccess()
          }
          this.$emit('operateSuccess')
          this.cancel()
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    },
    // 查询关联的用户列表
    async getBindUser (id) {
      const { data } = await axios.get('/group/bindUser', {
        params: {
          id
        }
      })
      this.formModel.user = JSONBig.parse(decrypt(data)).map(el => {
        if (el.leader === true) {
          this.formModel.leader = el.userId.toString()
        }
        return el.userId.toString()
      })
    },
    edit (user) {
      this.show('编辑部门')
      this.isEdit = true
      this.getBindUser(user.id)
      this.formModel.id = user.id
      this.formModel.name = user.name
      this.formModel.remark = user.remark
      this.formModel.enabled = Number(user.isOpen)
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
    leadList: function () {
      return this.userList.filter(el => {
        return this.formModel.user.indexOf(el.id) !== -1
      })
    }
  }
}
</script>

<style scoped>
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline >>> .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline >>> .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}
</style>
