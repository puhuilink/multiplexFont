<template>
  <a-spin :spinning="baseLoading">
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="姓名"
          >
            <a-input
              v-decorator="[
                'staff_name',
                {
                  rules: [
                    {
                      required: true,
                      message: '姓名必填'
                    },
                    {
                      pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/,
                      message: '仅支持中英文与数字'
                    },
                    {
                      max: 16,
                      message: '最多输入16个字符'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="岗位职责"
          >
            <a-input
              v-decorator="[
                'job_title',
                {
                  rules: [
                    {
                      required: true,
                      message: '名称必填'
                    },
                    {
                      max: 64,
                      message: '最多输入64个字符'
                    }
                  ]
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>

        <a-col :md="12" :span="24">
          <a-form-item
            label="备注"
          >
            <a-textarea
              rows="4"
              v-decorator="[
                'note',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 128,
                      message: '最多输入128个字符'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-button htmlType="submit" type="primary" @click="editUser">更新基本信息</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script>
import { UserService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import { pick } from 'lodash'
// import pick from 'lodash.pick'
export default {
  name: 'BaseSettings',
  data () {
    return {
      form: this.$form.createForm(this),
      userForm: [],
      where: {},
      baseLoading: false
    }
  },
  methods: {
    getUser (parameter) {
      return UserService.find({
        where: {
          ...generateQuery(parameter)
        },
        fields: ['user_id', 'staff_name', 'job_title', 'note'],
        alias: 'data'
      }).then((r) => r.data.data)
    },
    editUser () {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.baseLoading = true
          UserService.update(values, this.where).then((msg) => {
            this.$message.success('修改成功')
            this.$store.commit('SET_NAME', { name: values.staff_name })
          }).catch((e) => {
            this.$message.error('修改失败')
          }).finally(() => {
            this.baseLoading = false
          })
        }
      })
    }
  },
  async mounted () {
    try {
      this.baseLoading = true
      this.where = {
        user_id: this.$store.getters.roles.userId
      }
      const [data] = await this.getUser(this.where)
      this.userForm = data
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(pick(this.userForm, keys))
    } catch (error) {
      this.$message.error('获取数据失败')
    } finally {
      this.baseLoading = false
    }
  }
}
</script>
