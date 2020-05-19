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
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="用户名"
            v-bind="formItemLayout"
          >
            <a-input
              :disabled="title === '编辑'"
              v-decorator="[
                'user_id',
                {
                  rules: [
                    {
                      required: true,
                      message: '用户名必填'
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

        <a-col :md="12" :span="24">
          <a-form-item
            label="姓名"
            v-bind="formItemLayout"
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
            v-bind="formItemLayout"
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

        <a-col :md="12" :span="24">
          <a-form-item
            label="办公电话"
            v-bind="formItemLayout"
          >
            <a-input
              v-decorator="[
                'phone',
                { rules: [
                  { required: true, message: '办公电话必填' },
                  {
                    pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$',
                    message: '请输入正确的办公电话'
                  }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="移动电话"
            v-bind="formItemLayout"
          >
            <a-input
              v-decorator="[
                'mobile_phone',
                {
                  rules: [{
                    pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$',
                    message: '请输入正确的移动电话'
                  }]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="Email"
            v-bind="formItemLayout"
          >
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Email必填'
                    },
                    {
                      type: 'email',
                      message: '请输入正确的Email'
                    },
                    {
                      max: 32,
                      message: '最多输入32个字符'
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
            label="备注"
            v-bind="formItemLayout"
          >
            <a-textarea
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
        </a-col>

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
      </a-row>

    </a-form>
  </a-modal>
</template>

<script>
import { UserService } from '@/api-hasura'
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'UserSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: (vm) => ({
    confirmLoading: false,
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
      ]
    },
    record: null,
    submit: () => {}
  }),
  computed: {},
  methods: {
    add () {
      this.title = '新增'
      this.submit = this.insert
      this.visible = true
    },
    /**
       * 编辑
       * @param {Object} record
       * @return {Undefined}
       */
    async edit (record) {
      this.record = {
        ...record
      }
      this.title = '编辑'
      this.submit = this.update
      this.visible = true
      await this.$nextTick()
      this.form.setFieldsValue({
        ...record
      })
    },
    /**
     * 新增
     */
    async insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await UserService.add(values)
          this.$emit('addSuccess')
          this.$notification.success({
            message: '系统提示',
            description: '新增成功'
          })
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 编辑
     */
    async update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await UserService.update(
            values,
            { 'user_id': this.record.user_id }
          )
          this.$emit('editSuccess')
          this.$notification.success({
            message: '系统提示',
            description: '编辑成功'
          })
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
