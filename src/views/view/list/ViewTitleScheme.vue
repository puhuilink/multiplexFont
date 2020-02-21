<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    :width="720"
    wrapClassName="ViewTitleSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    :rowKey="record => `${record.user_id}${record.user.staff_name}`"
    okText="保存"
    @ok="submit"
  >
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="标题"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'view_title',
                {
                  rules: [
                    {
                      required: true,
                      message: '标题必填'
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
import { updateView } from '@/api/controller/View'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

export default {
  name: 'ViewTitleScheme',
  components: {},
  props: {},
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
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
    cancel () {
      this.visible = false
    },
    /**
     * 编辑
     */
    async update () {
      try {
        const values = await this.getFormFields()
        this.loading = true
        await updateView(this.record.view_id, values)
        this.$emit('editSuccess')
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async getFormFields () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">

</style>
