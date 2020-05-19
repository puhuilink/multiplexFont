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
    okText="保存"
    @ok="submit"
  >

    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="标题"
            v-bind="formItemLayout"
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
import _ from 'lodash'

export default {
  name: 'ViewTitleScheme',
  mixins: [Schema],
  data: () => ({
    record: null
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
      this.form.setFieldsValue(_.pick(record, ['view_title']))
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
          this.notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.notifyError(e)
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
          this.notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.notifyError(e)
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
