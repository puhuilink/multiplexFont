<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="640"
    wrapClassName="AlarmSolve__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-form :form="form" layout="vertical">
      <a-form-item
        label="处理意见"
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
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'AlarmSolve',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    open () {
      this.show('告警解决')
    }
  }
}
</script>

<style lang="less">

</style>
