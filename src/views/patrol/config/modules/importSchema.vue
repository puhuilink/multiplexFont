<template>
  <!-- 两步验证 -->
  <a-modal
    centered
    :title="title"
    v-model="visible"
    @cancel="cancel"
    :maskClosable="false"
    okText="提交"
    @ok="onSubmit"
    :afterClose="reset"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="originalForm" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="点击下载当前巡更路劲" prop="remark" extra="提示: 请先下载导入模板 excel文件，按格式填写后上传提交。">
        <a @click="downloadTemp">
          <a-icon type="download" />
          下载模板 </a>
      </a-form-model-item>
      <a-form-model-item label="选择导入文件" prop="file" extra="提示：只支持.xls.xlsx格式，且不超过10M">
        <a-upload
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <a-button>
            <a-icon type="upload" />
            上传文件
          </a-button>
        </a-upload>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { xungeng } from '@/utils/request'
import { downloadExcel } from '@/utils/util'
import { PathService } from '@/api'

export default {
  name: 'ImportSchema',
  mixins: [Schema],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      current: 0,
      confirmLoading: false,
      fileList: [],
      steps: [
        { title: '填写基本信息' },
        { title: '配置菜单权限' },
        { title: '配置数据权限' }
      ],
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      rules: {
        alias: [
          { required: true, message: '路径名称必填', trigger: 'blur' }
        ],
        file: [
          { required: true, message: '文件必须上传', trigger: 'change' },
          { validator: this.excelRequire, trigger: 'change' }
        ],
        ascription: [
          { max: 50, message: '最多50个字符', trigger: 'blur' }
        ]
      },
      originalForm: {
        alias: '',
        file: null,
        ascription: ''
      },
      record: null,
      status: true,
      pathId: ''
    }
  },
  methods: {
    excelRequire (rule, value, callback) {
      if (value.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        callback(new Error('文件类型为excel'))
      }
      callback()
    },
    handleStepOk () {
      const vm = this
      this.stepLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          setTimeout(() => {
            vm.stepLoading = false
            vm.$emit('success', { values })
          }, 2000)
          return
        }
        this.stepLoading = false
        this.$emit('error', { err })
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('cancel')
    },
    show (pathId = '') {
      this.title = '导入'
      this.visible = true
      this.pathId = pathId
      this.originalForm.pathId = this.pathId
    },
    handleRemove (file) {
      this.fileList = []
      if (this.originalForm.file && this.originalForm.file === file) {
        this.originalForm.file = null
      }
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleChange (fileObj) {
      const { file } = fileObj
      if (file.status === 'removed') {
        return
      }
      // this.$refs.ruleForm.clearValidate('file')
      this.fileList = [file]
      this.originalForm.file = file
    },
    /*
* 下载模板
* */
    async downloadTemp () {
      const data = await xungeng.request({
        url: '/export/path',
        responseType: 'blob',
        params: { pathId: this.pathId },
        method: 'get'
      })
      downloadExcel(`路径模板`, data)
      this.$notification.success({
        message: '系统提示',
        description: '导出路径成功'
      })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(async (err) => {
        if (!err) return
        try {
          this.confirmLoading = true
          await PathService.importPath(this.originalForm)
          this.$emit('refresh')
          this.cancel()
        } catch (e) {
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.step-form-wrapper {
  margin: 0 auto;
  width: 80%;
  max-width: 400px;
}
</style>
