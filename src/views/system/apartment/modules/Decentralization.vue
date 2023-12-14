<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    :width="550"
    v-model="visible"
    @cancel="onCancel"
    @ok="submit">
    <!--    destroyOnClose-->
    <a-form-model ref="ruleForm" :model="formModel" :rules="rules">
      <!--      <a-form-model-item
        label="选择部门"
        v-bind="formItemLayout"
        prop="Monitoring_module"
      >
        <a-tree-select
          v-model="formModel.Monitoring_module"
          placeholder="选择视图"
          allow-clear
          :treeData="treeData2"
          treeDefaultExpandAll
          :maxTagCount="10"
          :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
        >
        </a-tree-select>
      </a-form-model-item>-->
      <a-form-model-item
        label="安全漏洞机构编号"
        v-bind="formItemLayout"
        prop="sourceCode"
      >
        <a-input v-model="formModel.sourceCode"></a-input>
      </a-form-model-item>
    </a-form-model>
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button @click="onSubmit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

  </a-modal>
</template>

<script>

import Schema from '~~~/Mixins/Modal/Schema'
import { axios } from '@/utils/request'

export default {
  name: 'Decentralization',
  mixins: [Schema],
  props: {
    treeData2: {
      type: Array,
      default: () => [
      ]
    }
  },
  data () {
    return {
      submitLoading: false,
      formModel: {
        sourceCode: '',
        Monitoring_module: null
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16, offset: 1 }
      },
      rules: {
        sourceCode: [
          { max: 50, required: true, message: '请填写机构编号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '输入内容为大小写英文字母和数字', trigger: 'blur' }
        ],
        Monitoring_module: [
          { required: true, message: '请选着视图', trigger: 'blur' }
        ]

      },
      title: '分权分域',
      organizeId: null
    }
  },
  methods: {
    async edit (user) {
      this.visible = true
      // this.show('分权分域')
      this.organizeId = user.id

      // const { data: { sourceCode } } = await axios.get('/cloudNet/get')
      // this.sourceCode = sourceCode
    },
    onCancel () {
      this.visible = false
    },
    onSubmit () {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        try {
          this.submitLoading = true
          const res = await axios.post('/cloudNet/save', {
            // name: this.formModel.name,
            // parentId: this.formModel.apartmentId,
            organizeId: this.organizeId,
            sourceCode: this.formModel.sourceCode
            // Monitoring_module: this.Monitoring_module
          })

          if (res.code === 200) {
            this.$notification.success({
              message: '系统提示',
              description: '编辑成功'
            })
          } else {
            this.$notification.error({
              message: '系统提示',
              description: res.msg
            })
          }
          this.visible = false
          this.formModel.sourceCode = ''
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    }

  },
  computed: {

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
