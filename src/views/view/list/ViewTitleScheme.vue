<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
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
      <a-row></a-row>
      <a-col :md="12" :span="24">
        <a-form-item
          label="标题"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            allowClear
            v-decorator="[
              'view_title',
              {
                rules: [
                  {
                    transform: value => value.trim()
                  },
                  {
                    required: true,
                    message: '标题必填'
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
    </a-form>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { ViewListService } from '@/api-hasura/index'

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
  mixins: [Schema],
  components: {},
  props: {},
  data: (vm) => ({
    activeTabKey: '1',
    formItemLayout,
    record: null,
    submit: () => {}
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
    add () {
      this.title = '新建'
      this.submit = this.insert
      this.visible = true
    },
    /**
     * 新建
     */
    insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          await ViewListService.add(values)
          this.$emit('addSuccess')
          this.noticiAddSuccess()
          this.cancel()
        } catch (e) {
          this.noticiError(e)
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 编辑
     */
    update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          const { view_id } = this.record
          await ViewListService.update(values, { view_id })
          this.$emit('editSuccess')
          this.noticiEditSuccess()
          this.cancel()
        } catch (e) {
          this.noticiError(e)
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
