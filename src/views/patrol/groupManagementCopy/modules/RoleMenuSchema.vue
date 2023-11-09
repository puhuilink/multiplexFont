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
    <AuthMenu :record="authView.record" ref="menu" />
  </a-modal>
</template>

<script>
import { UserService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'

export default {
  name: 'RoleSchema',
  mixins: [Schema],
  components: { AuthMenu },
  props: {},
  data: (vm) => ({
    confirmLoading: false,
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
      ]
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
    async insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await UserService.add(values)
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 调取编辑接口
     */
    async update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          const { user_id } = this.record
          await UserService.update(values, { user_id })
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
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
