<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="640"
    wrapClassName="TemporaryApproveRule__modal"
    @cancel="cancel"
    :afterClose="reset"
    @ok="submit"
  >
    <template slot="footer">
      修改后仅本次生效
      保存修改
      <!-- <a-button @click="editRule" class="fl">告警审批规则</a-button> -->
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" type="primary">发送</a-button>
    </template>

    <a-form-model :form="form" ref="ruleForm" layout="vertical">
      <div
        class="TemporaryApproveRule__level"
        v-for="level in [1, 2, 3, 4, 5]"
        :key="level"
      >

        <a-form-model-item
          label="邮箱通知模板"
          v-bind="formItemLayout"
          prop="message"
        >

        </a-form-model-item>
      </div>

      <a-form-model-item label="邮箱通知模板" v-bind="formItemLayout" prop="message">
        <TempEditor ref="email" />
      </a-form-model-item>

      <a-form-model-item label="短信通知模板" v-bind="formItemLayout" prop="message">
        <TempEditor ref="message" />
      </a-form-model-item>
    </a-form-model>

    <TempEditor />

    <TempEditor />
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TempEditor from '@/components/Temp/TempEditor'
import { UserService } from '@/api-hasura'

export default {
  name: 'TemporaryApproveRule',
  mixins: [Schema],
  components: {
    TempEditor
  },
  props: {},
  data: () => ({
  }),
  computed: {
    ruleForm () {
      return {}
    }
  },
  methods: {
    async fetchUserList () {
      try {
        const { data: { userList } } = await UserService.find({
          fields: ['staff_name', 'user_id'],
          alias: 'userList'
        })
        this.userList = userList
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    open () {
      this.show('告警审批规则')
      this.fetchUserList()
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      this.$refs.emailEditor.resetContent()
      this.$refs.messageEditor.resetContent()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
.TemporaryApproveRule {
  &__level {}
}
</style>
