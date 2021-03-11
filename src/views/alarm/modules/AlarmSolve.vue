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
    okText="解决"
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
import { AlarmService } from '@/api'

export default {
  name: 'AlarmSolve',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    record: null
  }),
  computed: {},
  methods: {
    open (record) {
      this.show('告警解决')
      this.record = record
      this.submit = this.close
    },
    async close () {
      try {
        this.confirmLoading = true
        // FIXME：解决后未更新记录state值？
        await AlarmService.batchClose(this.record)
        this.cancel()
        this.$notification.success({
          message: '系统提示',
          description: '告警解决成功'
        })
        this.$emit('solveSuccess')
      } catch (e) {
        throw e
      } finally {
        this.confirmLoading = false
      }
    }
  }
}
</script>

<style lang="less">

</style>
