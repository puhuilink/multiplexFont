<template>
  <a-spin :spinning="loading">
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item label="姓名">
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
          <a-form-item label="岗位职责">
            <a-input
              v-decorator="[
                'job_title',
                {
                  rules: [
                    {
                      required: true,
                      message: '岗位职责必填'
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
          <a-form-item label="备注">
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
            <a-button htmlType="submit" type="primary" @click="editCurrentUser">
              更新基本信息
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script>
import { UserService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import { pick } from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { List } from '@/components/Mixins'

export default {
  name: 'BaseSettings',
  mixins: [List],
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  methods: {
    ...mapMutations(['SET_NAME']),
    /**
     * 获取当前用户信息
     * @event
     */
    getCurrentUser () {
      this.loading = true
      return UserService.find({
        where: {
          ...generateQuery({ user_id: this.userId })
        },
        fields: Object.keys(this.form.getFieldsValue()),
        alias: 'userList'
      })
        .then((r) => {
          const [userInfo] = r.data.userList
          const keys = Object.keys(this.form.getFieldsValue())
          this.form.setFieldsValue(pick(userInfo, keys))
        })
        .catch((e) => {
          this.$notifyError(e)
          throw e
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * 修改当前用户信息
     * @event
     */
    editCurrentUser () {
      this.form.validateFields((errors, values) => {
        if (errors) return
        this.loading = true
        UserService.update(values, { user_id: this.userId })
          .then((msg) => {
            this.$notifyEditSuccess()
            this.SET_NAME({ name: values.staff_name })
          })
          .catch((e) => {
            this.$notifyError(e)
            throw e
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  },
  mounted () {
    this.getCurrentUser()
  }
}
</script>
