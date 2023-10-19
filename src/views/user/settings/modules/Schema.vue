<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="300"
    :afterClose="reset"
    okText="提交"
    @ok="submit"
    :confirmLoading="confirmLoading"
    centered
  >
    <a-form-model
      ref="formModel"
      :model="formData"
    >
      <a-form-model-item
        label="修改为"
        prop="modelValue"
        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
      >
        <a-input placehodler="请输入" v-model="formData.modelValue"></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import { UserService } from '@/api'
import Vue from 'vue'
import { USER } from '@/store/mutation-types'
import Schema from '~~~/Mixins/Modal/Schema'

export default {
  name: 'Schema',
  mixins: [
    Schema
  ],
  props: {
    rule: {
      type: Array,
      default: () => [{ required: true, message: '排班名称必填', trigger: 'blur' }]
    },
    field: {
      type: String,
      default: () => 'mobile_phone'
    }
  },
  data () {
    return {
      formInline: {
        user: '',
        password: ''
      },
      formData: {
        modelValue: ''
      },
      submit: () => {},
      confirmLoading: false,
      formItemLayout: {
        // TODO: responsive
        labelCol: {
          // span: 6
        },
        wrapperCol: {
          span: 23
        }
      },
      visible: false,
      title: ''
    }
  },
  methods: {
    show (title) {
      this.title = title
      this.visible = true
    },
    cancel () {
      this.visible = false
      this.$emit('close', _.get(this.record, 'state'))
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    onTele () {
      this.show('修改电话号')
      this.submit = this.edit
    },
    edit () {
      console.log('动啊')
      this.$refs.formModel.validate(async isValid => {
        console.log('动啊', isValid)
        if (!isValid) return
        try {
          this.confirmLoading = true
          await UserService.update({ [this.field]: this.formData.modelValue, user_id: Vue.ls.get(USER).userId }, { user_id: Vue.ls.get(USER).userId })
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

<style scoped>

</style>
