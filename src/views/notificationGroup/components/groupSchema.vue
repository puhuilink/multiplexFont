<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="800"
    :afterClose="reset"
    :destroyOnClose="true"
    :confirmLoading="options.loading"
    centered>
    <template slot="footer">
      <a-button @click="prev" v-if="current === 1">上一步</a-button>
      <a-button @click="next" v-if="current < 1">下一步</a-button>
      <a-button type="primary" @click="submit" v-if="current === 1">提交</a-button>
    </template>
    <a-form :form="form">
      <a-steps :current="current">
        <a-step key="1" title="编辑基本信息"></a-step>
        <a-step key="2" title="分配用户"></a-step>
      </a-steps>
      <a-row v-show="onStep">
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
      <a-row v-show="onStep">
        <a-col :md="24" :span="24">
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
      <a-row v-show="!onStep" type="flex" justify="center">
        <assign ref="assign" :unassigned-user="options.user" style="margin-top: 10px" @updated="assUpdate"></assign>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { NotificationGroupService } from '@/api'
import assign from './assignSchema'

export default {
  name: 'GroupSchema',
  mixins: [Schema],
  components: { assign },
  data: () => {
    return {
      options: {
        flag: [
        ],
        disabled: false,
        loading: false
      },
      current: 0,
      assigned: [],
      testValue: ''
    }
  },
  methods: {
    async show (title) {
      await this.fillUser()
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
      const user = await NotificationGroupService.getUnassignedUser()
      this.options.user = user
    },
    next () {
      this.form.validateFields(async (err, values) => {
        if (err) return
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
        this.$nextTick(() => this.$refs.assign.setAdmin(values.group_admin))
        this.current++
      })
    },
    prev () {
      this.current--
    },
    assUpdate (value) {
      this.assigned = value
    }
  },
  computed: {
    onStep () {
      return this.current === 0
    }
  }
}
</script>

<style scoped>

</style>
