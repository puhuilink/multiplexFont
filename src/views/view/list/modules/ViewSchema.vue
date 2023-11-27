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
    okText="提交"
    @ok="submit"
  >

    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="视图标题"
            v-bind="formItemLayout"
          >
            <a-input
              allowClear
              v-decorator="[
                'view_title',
                {
                  rules: [
                    {
                      required: true,
                      message: '视图标题必填'
                    },
                    {
                      pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5_-]+$/,
                      message: '仅支持中英文、数字与短横线下划线'
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
            label="视图类型"
            v-bind="formItemLayout"
          >
            <a-select
              v-decorator="[
                'view_type',
                {
                  rules: [
                    {
                      required: true,
                      message: '视图类型必选'
                    },
                  ]
                }
              ]"
            >
              <a-select-option :value="VIEW_TYPE.template">{{ VIEW_TYPE_MAPPING.get(VIEW_TYPE.template) }}</a-select-option>
              <a-select-option :value="VIEW_TYPE.instance">{{ VIEW_TYPE_MAPPING.get(VIEW_TYPE.instance) }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { ViewListService } from '@/api'
import _ from 'lodash'
import { VIEW_TYPE } from '@/tables/view/enum'
import { VIEW_TYPE_MAPPING } from '@/tables/view/types'

export default {
  name: 'ViewSchema',
  mixins: [Schema],
  data: () => ({
    record: null,
    VIEW_TYPE,
    VIEW_TYPE_MAPPING
  }),
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
        try {
          this.confirmLoading = true
          await ViewListService.add(values)
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
    update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.confirmLoading = true
          const { view_id } = this.record
          await ViewListService.update(values, { view_id })
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
