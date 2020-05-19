<script>
import { RelationAttributeService } from '@/api-hasura/index'
import Timeout from 'await-timeout'
import {
  AllowInheritance,
  AllowNull,
  AssetsAttr,
  DefaultValue,
  Label,
  MappingType,
  MatchType,
  Name,
  Order,
  SearchField,
  RelationType,
  TabGroup,
  Target
} from './common/index'
import mixin from './mixin'
import _ from 'lodash'

export default {
  name: 'ModelRelationSchema',
  props: {},
  mixins: [mixin],
  data: (vm) => ({
    source: null,
    loading: false,
    record: null,
    submit: () => {}
  }),
  computed: {},
  methods: {
    /**
     * 新增
     * @param {String} source 关联
     */
    add (source) {
      this.title = '新增'
      this.visible = true
      this.source = source
      this.submit = this.insert
    },
    /**
       * 编辑
       * @param {Object} record
       * @return {Undefined}
       */
    async edit (record) {
      this.title = '编辑'
      this.visible = true
      this.submit = this.update
      this.record = {
        ...record
      }
      this.source = this.record.source
      await this.$nextTick()
      // FIXME: checkbox
      await Timeout.set(300)
      this.form.setFieldsValue(record)
    },
    cancel () {
      this.visible = false
    },
    async insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.loading = true
          await RelationAttributeService.add({
            ...values,
            source: this.source
          })
          this.$emit('addSuccess')
          this.notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.notifyError(e)
          throw e
        } finally {
          this.loading = false
        }
      })
    },
    // FIXME: 所有表单长度校验。。。
    async update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.loading = true
          await RelationAttributeService.update({
            ...values,
            source: this.source
          }, { _id: this.record._id })
          this.$emit('editSuccess')
          this.notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.notifyError(e)
          throw e
        } finally {
          this.loading = false
        }
      })
    }
  },
  render () {
    const {
      form, loading, title,
      visible, cancel, reset, submit
    } = this
    return (
      <a-modal
        centered
        confirmLoading={loading}
        destroyOnClose
        title={title}
        visible={visible}
        width={940}
        wrapClassName="ModelSchema__modal"
        onCancel={cancel}
        afterClose={reset}
        okText="保存"
        cancelText="取消"
        onOk={submit}
      >
        <a-form form={form} layout="vertical">
          {
            ..._.chunk([
              <Name formChildProps={{ disabled: title === '编辑' }} />,
              <Label />,
              <Target />,
              <MappingType />,
              <RelationType />,
              <TabGroup />,
              <Order />,
              <AllowInheritance />,
              <SearchField />,
              <MatchType />,
              <AllowNull />,
              <AssetsAttr />,
              <DefaultValue />
            ], 2).map(els => (
              <a-row>
                {
                  ...els.map(el => (
                    <a-col md={12} span={24}>
                      { el }
                    </a-col>)
                  )
                }
              </a-row>
            ))
          }
        </a-form>
      </a-modal>
    )
  }
}
</script>
