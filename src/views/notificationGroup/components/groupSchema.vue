<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="800"
    :afterClose="reset"
    :confirmLoading="loading"
    okText="提交"
    @ok="submit"
    centered>
    <a-form :form="form">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="通知组名称"
            v-bind="formItemLayout"
          >
            <a-input
              v-decorator="[
                'group_name',
                {
                  rules: [
                    {
                      required: true,
                      message: '通知组名称'
                    },
                    {
                      pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/,
                      message: '仅支持中英文与数字'
                    },
                    {
                      max: 30,
                      message: '最多输入30个字符'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-item
            label="管理员"
            v-bind="formItemLayout"
          >
            <a-select
              v-decorator="[
                'group_admin',
                {
                  rules: [
                    {
                      required: true,
                      message: '管理员必填'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="item in options.user"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="有效标志"
            v-bind="formItemLayout"
          >
            <a-select
              v-decorator="[
                'flag',
                {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: '有效标志必填'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="item in options.flag"
                :key="item.value"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-item
            label="备注"
            v-bind="formItemLayout"
          >
            <a-textarea
              v-decorator="[
                'remarks',
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
            ></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { NotificationGroupService } from '@/api'

export default {
  name: 'GroupSchema',
  mixins: [Schema],
  data: () => {
    return {
      options: {
        flag: [
          {
            name: '有效',
            value: 1
          },
          {
            name: '无效',
            value: 0
          }
        ],
        disabled: false,
        loading: false
      }
    }
  },
  methods: {
    show (title) {
      this.visible = true
      this.title = title
    },
    add () {
      // TODO 校验表单并提交新增接口
      this.form.validateFields(async (err, values) => {
        if (err) return
        this.confirmLoading = true
        // return Service.add(values)
        //   .then(res => {
        //     this.$emit('addSuccess')
        //     this.$notifyAddSuccess()
        //     this.cancel()
        //   })
        //   .catch(e => {
        //     this.$notifyError(e)
        //     throw e
        //   })
        //   .finally(() => {
        //     this.confirmLoading = false
        //   })
      })
    },
    onAdd (title) {
      this.show(title)
      this.submit = this.add
    },
    edit () {
      // TODO 校验表单并提交编辑接口
    },
    onEdit (title) {
      this.show(title)
      this.submit = this.edit()
    },
    async fillUser () {
      const { data: { User } } = await NotificationGroupService.getUser()
      this.options.user = User
    }
  },
  mounted () {
    this.fillUser()
  }
}
</script>

<style scoped>

</style>
