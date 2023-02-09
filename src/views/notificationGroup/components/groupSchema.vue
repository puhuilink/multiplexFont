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
      <a-button type="primary" @click="submit" v-if="current === 1" :loading="submitSta">提交</a-button>
    </template>
    <a-form-model :model="formModel" :rules="rules" ref="form">
      <a-steps :current="current">
        <a-step key="1" title="编辑基本信息"></a-step>
        <a-step key="2" title="分配用户"></a-step>
      </a-steps>
      <a-row v-show="onStep">
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="通知组名称"
            v-bind="formItemLayout"
            prop="group_name"
          >
            <a-input
              v-model="formModel.group_name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="管理员"
            v-bind="formItemLayout"
            prop="group_admin"
          >
            <a-select
              v-model="formModel.group_admin"
            >
              <a-select-option
                v-for="item in options.user"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-show="onStep">
        <a-col :md="24" :span="24">
          <a-form-model-item
            label="备注"
            v-bind="formItemLayout"
            prop="remarks"
          >
            <a-textarea
              v-model="formModel.remarks"
            ></a-textarea>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-show="!onStep" type="flex" justify="center">
        <assign ref="assign" :unassigned-user="options.user" style="margin-top: 10px" @updated="assUpdate"></assign>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { NotificationGroupService } from '@/api'
import assign from './assignSchema'
import { alarm } from '@/utils/request'
import _ from 'lodash'
const rules = {
  group_name: [
    {
      required: true,
      message: '通知组名称',
      trigger: 'blur'
    },
    {
      pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/,
      message: '仅支持中英文与数字',
      trigger: 'blur'
    },
    {
      max: 30,
      message: '最多输入30个字符',
      trigger: 'change'
    }
  ],
  group_admin: [
    {
      required: true,
      message: '管理员必填',
      trigger: 'change'
    }
  ],
  remarks: [
    {
      max: 128,
      message: '最多输入128个字符'
    }
  ]
}

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
        loading: false,
        user: []
      },
      formModel: {
        remarks: '',
        group_admin: '',
        group_name: '',
        user: []
      },
      current: 0,
      assigned: [],
      unassigned: [],
      testValue: '',
      rules,
      submitSta: false
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
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        this.confirmLoading = true
        try {
          this.submitSta = true
          const query = {
            group: {
              name: this.formModel.group_name,
              remark: this.formModel.remark
            },
            users: this.assigned
          }
          const { code } = await alarm.post('/api/configuration/group/add', query)
          if (code === 200) {
            this.$notification.success({
              message: '系统提示',
              description: '添加成功'
            })
            this.cancel()
            this.$emit('success')
          }
        } catch (e) {
          this.$notification.error({
            message: '参数不正确'
          })
          throw e
        } finally {
          this.submitSta = false
        }
      })
    },
    onAdd (title) {
      this.show(title)
      this.submit = this.add
    },
    edit () {
      // TODO 校验表单并提交编辑接口
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        this.confirmLoading = true
        try {
          this.submitSta = true
          const query = {
            group: {
              id: this.formModel.id,
              name: this.formModel.group_name,
              remark: this.formModel.remark
            },
            users: this.assigned
          }
          const { code } = await alarm.post('/api/configuration/group/update', query)
          if (code === 200) {
            this.$notification.success({
              message: '系统提示',
              description: '修改成功'
            })
            this.cancel()
            this.$emit('success')
          }
        } catch (e) {
          this.$notification.error({
            message: '参数不正确'
          })
          throw e
        } finally {
          this.submitSta = false
        }
      })
    },
    async onEdit (title, params = {}) {
      await this.show(title)
      Object.assign(this.formModel, { 'group_name': params[0].groupName, 'remarks': params[0].remarks })
      const id = _.get(params, '0.groupId', '')
      this.formModel.id = id
      this.findById(params)
      this.submit = this.edit
    },
    async fillUser () {
      const user = await NotificationGroupService.getUnassignedUser()
      this.options.user = user
    },
    async findById (id) {
      NotificationGroupService.findUser(id).then(r => {
        const index = _.findIndex(r, (el) => el.leader === true)
        const val = _.cloneDeep(r)
        this.$nextTick(() => {
          r.map(el => this.options.user.push({ label: _.get(el, 'accountName', ''), value: _.get(el, 'accountId', '') }))
          this.unassigned = _.remove(val, (n) => n.leader !== true).map(el => ({ key: el.accountId, title: el.accountName, disabled: false }))
          this.$refs.assign.setCommon(this.unassigned)
          Object.assign(this.formModel, { 'group_admin': r[index].accountId })
        }
        )
      })
    },
    next () {
      this.$refs.form.validate(async err => {
        if (!err) return
        this.$nextTick(() => {
          this.$refs.assign.setAdmin(this.formModel.group_admin)
        })
        this.current++
      })
    },
    prev () {
      this.current--
    },
    assUpdate (value) {
      this.assigned = value
    },
    reset () {
      this.$refs.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
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
