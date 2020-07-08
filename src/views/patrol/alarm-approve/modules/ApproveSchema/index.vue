<template>
  <fragment>
    <a-modal
      centered
      :confirmLoading="confirmLoading"
      :title="title"
      v-model="visible"
      :width="640"
      wrapClassName="ApproveSchema__modal"
      @cancel="cancel"
      :afterClose="reset"
      okText="发送"
      cancelText="取消"
      @ok="submit"
    >
      <template slot="footer">
        <a-button @click="editRule" class="fl">告警审批规则</a-button>
        <a-button @click="cancel">取消</a-button>
        <a-button @click="submit" type="primary">发送</a-button>
      </template>

      <a-form :form="form" layout="vertical">
        <a-form-item
          label="审批意见"
          v-bind="formItemLayout"
        >
          <a-textarea
            :autoSize="{ minRows: 4, maxRows: 4 }"
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
      </a-form>
    </a-modal>

    <TemporaryApproveRule ref="rule" />
  </fragment>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TemporaryApproveRule from './TemporaryApproveRule'

export default {
  name: 'ApproveSchema',
  mixins: [Schema],
  components: {
    TemporaryApproveRule
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    approve () {
      this.show('告警审批')
    },
    editRule () {
      this.$refs['rule'].open()
    }
  }
}
</script>

<style lang="less">

</style>
