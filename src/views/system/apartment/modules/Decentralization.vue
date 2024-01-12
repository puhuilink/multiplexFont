<template>
  <a-modal
    centered
    :title="title"
    :width="750"
    v-model="visible"
  >
    <!--    漏洞-->
    <a-form-model ref="ruleForm" :model="formModel" :rules="rules" v-if="ifTitle==='leak'">
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
        label="Token："
        v-bind="formItemLayout"
        prop="sourceCode"
      >
        <a-input v-model="formModel.sourceCode"></a-input>
      </a-form-model-item>
    </a-form-model>
    <!--感知-->
    <a-form-model ref="ruleFormPerceive" :model="formModel" :rules="rulesPerceive" v-if="ifTitle==='perceive'">
      <a-form-model-item
        label="Token1："
        v-bind="formItemLayout"
        prop="overviewToken"
      >
        <a-input v-model="formModel.overviewToken"></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="Token2："
        v-bind="formItemLayout"
        prop="dashboardToken"
      >
        <a-input v-model="formModel.dashboardToken"></a-input>
      </a-form-model-item>
    </a-form-model>
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-button @click="onCancel">取消</a-button>
      <a-button @click="onSubmit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

  </a-modal>
</template>

<script>

// import Schema from '~~~/Mixins/Modal/Schema'
import { axios } from '@/utils/request'

export default {
  name: 'Decentralization',
  // mixins: [Schema],
  props: {
    // treeData2: {
    //   type: Array,
    //   default: () => [
    //   ]
    // }
  },
  data () {
    return {
      visible: false,
      submitLoading: false,
      formModel: {
        sourceCode: '',
        Monitoring_module: null,
        // 态势感知
        overviewToken: null,
        dashboardToken: null
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16, offset: 1 }
      },
      rules: {
        sourceCode: [
          { required: true, message: '请填写token', trigger: 'blur' }
          // { pattern: /^[a-zA-Z0-9]+$/, message: '输入内容为大小写英文字母和数字', trigger: 'blur' }
        ]
      },
      rulesPerceive: {
        overviewToken: [
          { required: true, message: '请填写token', trigger: 'blur' }
          // { pattern: /^[a-zA-Z0-9]+$/, message: '输入内容为大小写英文字母和数字', trigger: 'blur' }
        ],
        dashboardToken: [
          { required: true, message: '请填写token', trigger: 'blur' }
          // { pattern: /^[a-zA-Z0-9]+$/, message: '输入内容为大小写英文字母和数字', trigger: 'blur' }
        ]

      },
      title: '对接系统参数设置',
      organizeId: null,
      ifTitle: ''
    }
  },
  methods: {
    async edit (user) {
      this.organizeId = user.id
      this.ifTitle = 'leak'
      this.visible = true
      // console.log(this.organizeId)
      try {
        await axios.get('/cloudNet/get', { params: { orgId: this.organizeId } }).then(data => {
          // console.log(data)
          if (data.code === 200) {
            if (data.data.length > 0) {
              this.formModel.sourceCode = data.data[0].sourceCode
            } else {
              this.formModel.sourceCode = ''
              this.$notification.success({
                message: '系统提示',
                description: '该单位暂无漏洞统计管理token,请输入'
              })
            }
          } else {
            this.$notification.error({
              message: '系统提示',
              // description: data.data.description
              description: '网络错误'
            })
          }
        })
      } catch (e) {

      }

      // this.show('对接系统')
    },
    // 安全态势感知
    async editPerceive (user) {
      this.organizeId = user.id
      this.ifTitle = 'perceive'
      this.visible = true
      try {
        await axios.get('/ngsoc/get', { params: { orgId: this.organizeId } }).then(data => {
          // console.log(data)
          if (data.code === 200) {
            if (data.data.length > 0) {
              this.formModel.overviewToken = data.data[0].overviewToken
              this.formModel.dashboardToken = data.data[0].dashboardToken
            } else {
              this.formModel.overviewToken = ''
              this.formModel.dashboardToken = ''
              this.$notification.success({
                message: '系统提示',
                description: '该单位暂无安全态势感知token,请输入'
              })
            }
          } else {
            this.$notification.error({
              message: '系统提示',
              // description: data.data.description
              description: '网络错误'
            })
          }
        })
      } catch (e) {

      }
    },
    onCancel () {
      this.visible = false
    },
    onSubmit () {
      // 漏洞
      if (this.ifTitle === 'leak') {
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
              this.$emit('operateSuccess')
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
      // 安全态势感知
      if (this.ifTitle === 'perceive') {
        this.$refs.ruleFormPerceive.validate(async validate => {
          if (!validate) {
            throw new Error('参数不正确')
          }
          try {
            this.submitLoading = true
            const res = await axios.post('/ngsoc/save', {
              organizeId: this.organizeId,
              overviewToken: this.formModel.overviewToken,
              dashboardToken: this.formModel.dashboardToken
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
