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
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="工作组名称"
            v-bind="formItemLayout"
          >
            <a-input
              v-decorator="[
                'group_name',
                {
                  rules: [
                    {
                      required: true,
                      message: '工作组名称必填'
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
            label="工作组编号"
            v-bind="formItemLayout"
          >
            <a-input
              :disabled="title === '编辑'"
              v-decorator="[
                'group_id',
                {
                  rules: [
                    {
                      pattern: /[a-zA-Z0-9]/,
                      message: '仅支持英文与数字'
                    },
                    {
                      required: true,
                      message: '工作组编号必填'
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
            label="域"
            v-bind="formItemLayout"
          >
            <a-select
              allowClear
              v-decorator="[
                'domain',
                {
                  initialValue: 'bjDomain',
                  rules: [
                    {
                      required: true,
                      message: '域必填'
                    }
                  ]
                }
              ]"
            >
              <a-select-opt-group
                v-for="domain in options.domain"
                :key="domain.name"
                :label="domain.name"
              >
                <a-select-option
                  v-for="{ name, value } in domain.children"
                  :key="value"
                  :value="value"
                >{{ name }}</a-select-option>
              </a-select-opt-group>
            </a-select>
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
      </a-row>

    </a-form>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { GroupService } from '@/api'
import _ from 'lodash'
import { dataDomain } from '@/components/Common'

export default {
  name: 'UserSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: (vm) => ({
    options: {
      flag: [
        {
          name: '有效',
          value: '1'
        },
        {
          name: '无效',
          value: '0'
        }
      ],
      domain: dataDomain
    },
    record: null,
    submit: () => {}
  }),
  computed: {},
  methods: {
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
      this.record = { ...record }
      this.submit = this.update
      this.show('编辑')
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      this.form.setFieldsValue(_.pick(record, keys))
    },
    /**
     * 调取新增接口
     */
    insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        this.confirmLoading = true
        return GroupService.add(values)
          .then(res => {
            this.$emit('addSuccess')
            this.$notifyAddSuccess()
            this.cancel()
          })
          .catch(e => {
            this.$notifyError(e)
            throw e
          })
          .finally(() => {
            this.confirmLoading = false
          })
      })
    },
    /**
     * 调取编辑接口
     */
    update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        this.confirmLoading = true
        const { group_id } = this.record
        return GroupService.update(values, { group_id })
          .then(res => {
            this.$emit('editSuccess')
            this.$notifyEditSuccess()
            this.cancel()
          })
          .catch(e => {
            this.$notifyError(e)
            throw e
          })
          .finally(() => {
            this.confirmLoading = false
          })
      })
    }
  }
}
</script>

<style lang="less">
</style>
