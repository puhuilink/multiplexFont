<template>
  <a-modal
    :afterClose="reset"
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    :width="700"
    v-model="visible"
    wrapClassName="AlarmPopupDetail__modal"
    @cancel="onCancel"
    destroyOnClose
    @ok="submit">
    <a-form-model ref="ruleForm" :model="formModel" :rules="rules">
      <a-row :gutter="[5, 8]" type="flex" align="middle">
        <a-col :span="24">
          <a-form-model-item
            label="归属部门"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="orgId"
            :rules="[{ required: true, message: '请填写部门名称' }]"
          >
            <a-tree-select
              v-model="formModel.orgId"
              placeholder="选择上级部门"
              allow-clear
              tree-default-expand-all
              :treeData="treeData"
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="楼层"
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            prop="floor"
            :rules="[{ required: true, message: '请填写楼层' }]"
          >
            <a-input v-model="formModel.floor"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <!-- 上传图片           -->
          <a-form-model-item
            v-bind="{
              labelCol: { span: 6, offset: 0 },
              wrapperCol: { span: 18 },
            }"
            label="选择导入文件"
            prop="file"
            extra="提示大小不超过10M">
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
        </a-col>

      </a-row>
    </a-form-model>
    <template #footer>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="onSubmit" :loading="submitLoading" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { axios } from '@/utils/request'

export default {
  name: 'Schema',
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  mixins: [Schema],
  data () {
    return {
      submitLoading: false,
      formModel: {
        orgId: '', // 部门
        floor: '', // 楼层
        file: null
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16, offset: 1 }
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
    add (text = null) {
      this.show('新建用户')
      this.formModel.apartmentId = text
    },
    onSubmit () {
      this.$refs.ruleForm.validate(validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        try {
          this.submitLoading = true
          axios.post('/user/save', {
            orgId: this.formModel.orgId,
            file: this.formModel.file,
            floor: this.formModel.floor
          })
          this.$emit('operateSuccess')
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    },
    edit (user) {
      console.log('user', user)
      this.show('编辑用户')
      this.formModel = {
        orgId: user.orgId,
        file: user.file,
        floor: user.floor
      }
    },
    onCancel () {
      this.visible = false
    },
    handleChange (fileObj) {
      console.log(fileObj)
      // const { file } = fileObj
      // if (file.status === 'removed') {
      //   return
      // }
      // this.fileList = [file]
      this.formModel.file = fileObj
    },
    beforeUpload (file) {
      console.log(file)
    },
    // 删除文件
    handleRemove (file) {
      this.fileList = []
      if (this.originalForm.file && this.originalForm.file === file) {
        this.originalForm.file = null
      }
    }
  }
}
</script>

<style scoped>

</style>
