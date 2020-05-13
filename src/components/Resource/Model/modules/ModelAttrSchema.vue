<script>
import { ModelService } from '@/api-hasura/index'
import {
  AllowInheritance,
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
  SourceType,
  SourceValue,
  TabGroup,
  Uniqueness,
  UniquenessScope,
  Width
} from './common/index'
import mixin from './mixin'
import _ from 'lodash'
import Timeout from 'await-timeout'

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
      await Timeout.set(300)
      this.form.setFieldsValue(record)
      this.searchFieldInput()
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
          this.noticiAddSuccess()
          this.cancel()
        } catch (e) {
          this.noticiError(e)
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
          this.noticiEditSuccess()
          this.cancel()
        } catch (e) {
          this.noticiError(e)
          throw e
        } finally {
          this.loading = false
        }
      })
    }
  },
  render () {
    const {
      form, loading, title, visible, disableMatchType,
      cancel, reset, submit, searchFieldInput
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
              <Label />,
              <Name formChildProps={{ disabled: title === '编辑' }} />,
              <Width />,
              <DataType />,
              <DisplayType />,
              <SourceType />,
              <SearchField onInput={searchFieldInput} />,
              <AllowNull />,
              <MatchType formChildProps={{ disabled: disableMatchType }} />,
              <SourceValue />,
              <AllowInheritance />,
              <Hidden />,
              <Edit />,
              <TabGroup />,
              <DefaultValue />,
              <OperationValue />,
              <Order />,
              <Uniqueness />,
              <UniquenessScope />,
              <Pattern />,
              <AlertMessage />,
              <AssetsAttr />
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
