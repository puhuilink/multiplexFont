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
    okText="提交"
    cancelText="取消"
    @ok="submit"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="originalForm" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="巡更路径名称" prop="alias">
        <a-input v-model="originalForm.alias"/>
      </a-form-model-item>
      <a-form-model-item label="点击下载巡更路径模板" prop="remark" extra="提示: 请先下载导入模板 excel文件，按格式填写后上传提交。" v-if="status">
        <a href="http://10.201.246.55/xunjian/export/pathTemplate"><a-icon type="download" /> 下载模板 </a>
      </a-form-model-item>
      <a-form-model-item label="选择导入文件" prop="file" extra="提示：只支持.xls.xlsx格式，且不超过10M" v-if="status">
        <a-upload
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <a-button><a-icon type="upload" /> 上传文件 </a-button>
        </a-upload>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { PathService, UserService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'
import { dataFilter } from 'echarts/lib/component/marker/markerHelper'
import { xungeng } from '@/utils/request'
import { downloadExcel } from '@/utils/util'

export default {
  name: 'PathSchema',
  mixins: [Schema],
  components: { AuthMenu },
  props: {},
  data: (vm) => ({
    current: 0,
    confirmLoading: false,
    fileList: [],
    steps: [
      { title: '填写基本信息' },
      { title: '配置菜单权限' },
      { title: '配置数据权限' }
    ],
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    rules: {
      alias: [
        { required: true, message: '路径名称必填', trigger: 'blur' }
      ],
      file: [
        { required: true, message: '文件必须上传', trigger: 'blur' }
      ]
    },
    originalForm: {
      alias: '',
      file: null
    },
    record: null,
    status: true,
    submit: () => {}
  }),
  computed: {},
  methods: {
    dataFilter,
    handleChange (fileObj) {
      const { file } = fileObj
      if (file.status === 'removed') {
        return
      }
      this.$refs.ruleForm.clearValidate('file')
      this.fileList = [file]
      this.originalForm.file = file
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
    logSth (el) {
      this.menuForm.menuCodes = [...el]
    },
    // 步骤条向下逻辑
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
      this.status = false
      const { id, alias } = record
      this.originalForm = { id, alias }
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
      this.$refs.ruleForm.validate(async (err) => {
        if (!err) return
        try {
          this.confirmLoading = true
          await PathService.add(this.originalForm)
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
      this.$refs.ruleForm.validateField('alias', async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await PathService.updatePath(this.originalForm.id, this.originalForm.alias)
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
    },
    /*
    * 下载模板
    * */
    async downloadTemp () {
      const data = await xungeng.get('/export/pathTemplate')
      downloadExcel('路线模板', data)
      this.$notification.success({
        message: '系统提示',
        description: '导出路线模板成功'
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
