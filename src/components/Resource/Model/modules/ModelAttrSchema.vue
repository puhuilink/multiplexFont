<script>
import { ModelService } from '@/api-hasura/index'
import {
  AlertMessage,
  AllowNull,
  AssetsAttr,
  DataType,
  DefaultValue,
  DisplayType,
  Edit,
  Hidden,
  Label,
  MatchType,
  Name,
  Order,
  OperationValue,
  Pattern,
  SearchField,
  SourceValue,
  TabGroup,
  Uniqueness,
  UniquenessScope,
  Width
} from './common/index'
import mixin from './mixin'

export default {
  name: 'ModelAttrScheme',
  mixins: [mixin],
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: (vm) => ({
    loading: false,
    record: null,
    submit: () => {}
  }),
  computed: {},
  methods: {
    add () {
      this.title = '新增'
      this.submit = this.insert
      this.visible = true
    },
    /**
       * 编辑
       * @param {Object} record
       * @return {Promise<Undefined>}
       */
    async edit (record) {
      this.title = '编辑'
      this.submit = this.update
      this.record = {
        ...record
      }
      this.visible = true
      await this.$nextTick()
      this.form.setFieldsValue(record)
    },
    cancel () {
      this.visible = false
    },
    /**
     * 新增
     */
    async insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.loading = true
          await ModelService.addAttr(values, this.where)
          this.$emit('addSuccess')
          this.$notification.success({
            message: '系统提示',
            description: '新增成功'
          })
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
          throw e
        } finally {
          this.loading = false
        }
      })
    },
    /**
     * 编辑
     */
    async update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        const {
          where: {
            name: modelName
          }
        } = this
        try {
          this.loading = true
          await ModelService.updateAttr(modelName, values)
          this.$emit('editSuccess')
          this.$notification.success({
            message: '系统提示',
            description: '编辑成功'
          })
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
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
          <a-row>
            {
              ...[
                <Label />,
                <Name formChildProps={{ disabled: title === '编辑' }} />,
                <Width />,
                <DataType />,
                <DisplayType />,
                <SourceType />,
                <SearchField />,
                <AllowNull />,
                <MatchType />,
                <SourceValue />,
                <Hidden />,
                <Edit />,
                <TabGroup />,
                <AssetsAttr />,
                <DefaultValue />,
                <OperationValue />,
                <Order />,
                <Uniqueness />,
                <UniquenessScope />,
                <Pattern />,
                <AlertMessage />,
                <AssetsAttr />
              ].map(el => (
                <a-col md={12} span={24}>
                  { el }
                </a-col>
              ))
            }
          </a-row>
        </a-form>
      </a-modal>
    )
  }
}
</script>
