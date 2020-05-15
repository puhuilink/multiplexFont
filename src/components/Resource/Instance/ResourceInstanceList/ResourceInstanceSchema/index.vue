<script>
import Edit from './Edit'
import Add from './Add'
import {
  InstanceService,
  ModelService
} from '@/api-hasura/index'
import _ from 'lodash'

export default {
  name: 'ResourceInstanceSchema',
  components: {},
  props: {},
  data: (vm) => ({
    // 资源实例属性
    attributes: [],
    // 资源实例关系属性
    relationAttributes: [],
    // 提交按钮 loading
    submitLoading: false,
    // 主区域 loading
    spinning: false,
    // 编辑状态下资源实例数据
    instance: null,
    // enum { add, edit }
    mode: 'add',
    // modal 标题
    title: '',
    // modal visible
    visible: false,
    parentName: '',
    parentTree: '',
    _id: ''
  }),
  computed: {},
  methods: {
    /**
     * 加载实例的属性与关系属性（继承自模型）
     * @param {String} parentName 其所属模型的 name
     * @return {Promise<any>}
     */
    async loadAttributes (parentName, parentTree) {
      try {
        this.spinning = true
        const { attributes, relationAttributes } = await ModelService.attrInfo(parentName)
        this.attributes = _.orderBy(attributes, ['orderBy'], ['asc'])
        this.relationAttributes = relationAttributes
        this.relationAttributes.length && await this.loadRelationTargetList()
        this.attributes.filter(el => !!el.sourceValue).length && await this.loadSourceValueList()
        // FIXME: 关系信息 tab 页签闪烁
      } catch (e) {
        this.attributes = []
        this.relationAttributes = []
        throw e
      } finally {
        this.spinning = false
      }
    },
    /**
     * 加载其关系属性关联的实例
     * @return {Promise<any>}
     */
    async loadRelationTargetList () {
      const { relationAttributes } = this
      const modelList = relationAttributes.map(({ target }) => target)
      try {
        const { data: { targetList } } = await ModelService.find({
          where: {
            name: { _in: modelList }
          },
          fields: [
            'name',
            'label',
            'value: name',
            `children: instanceList {
              label
              value: name
              parentName
            }`
          ],
          alias: 'targetList'
        })
        relationAttributes.forEach((attribute, index) => {
          Object.assign(attribute, {
            // 为 DynamicForm / DynamicFormItem 保持一致入参
            selectGroupList: targetList[index] ? [targetList[index]] : [],
            displayType: 'SELECTED'
          })
        })
        this.relationAttributes = relationAttributes
      } catch (e) {
        this.relationAttributes = []
        throw e
      }
    },
    async loadSourceValueList () {
      const sourceValueAttrList = this.attributes.filter(el => !!el.sourceValue)
      const sourceValueList = sourceValueAttrList.map(({ sourceValue }) => sourceValue)
      const { data: { instanceList } } = await InstanceService.find({
        where: {
          name: {
            _in: sourceValueList
          }
        },
        fields: [
          '_id',
          'name',
          `value: values(path: "$.valueCode")`,
          `label: values(path: "$.valueLabel")`
        ],
        alias: 'instanceList'
      })
      sourceValueAttrList.forEach((attribute, index) => {
        const selectOptionList = instanceList.filter(({ name }) => name === attribute.sourceValue)
        Object.assign(attribute, {
          // 为 DynamicForm / DynamicFormItem 保持一致入参
          selectOptionList: selectOptionList,
          displayType: 'SELECTED'
        })
      })
    },
    async add (parentName, parentTree) {
      this.mode = 'add'
      this.title = '新增'
      this.visible = true
      // this.submit = this.insert
      this.parentName = parentName
      this.parentTree = parentTree
      await Promise.all([
        this.loadAttributes(parentName),
        this.loadRelationTargetList(parentName)
      ])
    },
    /**
     * 编辑
     * @param {String} parentName
     * @param {String} _id 实例 id
     * @return {Promise<Undefined>}
     */
    async edit (parentName, _id) {
      this.mode = 'edit'
      this.title = '编辑'
      // this.submit = this.update
      this.parentName = parentName
      this.visible = true
      this._id = _id
      await Promise.all([
        this.loadAttributes(parentName),
        this.loadData(_id)
      ])
    },
    cancel () {
      this.visible = false
    },
    /**
     * 加载实例详情
     * @param {String} _id 实例 id
     * @return {Promise<any>}
     */
    async loadData (_id) {
      try {
        this.instance = await InstanceService.detail(_id)
        // this.setFormValue()
      } catch (e) {
        this.instance = null
        throw e
      }
    },
    reset () {
      // 表单元素会在 destroyOnClose 时重置
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async submit () {
      this.$refs['form'].submit(async (err, values) => {
        if (err) return
        console.log(values)
        // return
        // eslint-disable-next-line no-unreachable
        try {
          this.submitLoading = true
          const { insert, update } = this
          await (this.title === '新增' ? insert(values) : update(values))
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    },
    async insert (values) {
      try {
        const { parentName, parentTree } = this
        await InstanceService.add({
          values,
          parentName,
          parentTree
        })
        this.$emit('addSuccess')
        this.$notification.success({
          message: '系统提示',
          description: '新建成功'
        })
      } catch (e) {
        throw e
      }
    },
    async update (values) {
      try {
        const { _id } = this
        await InstanceService.update({
          values,
          parentName: this.parentName,
          _id
        }, { _id: { _eq: _id } })
        this.$emit('addSuccess')
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
      } catch (e) {
        throw e
      }
    }
  },
  render (h) {
    const {
      cancel, reset, submitLoading, spinning, submit, title, visible,
      instance,
      attributes: attributeList,
      relationAttributes: relationAttributeList
    } = this

    return (
      <a-modal
        afterClose={reset}
        cancelText="取消"
        confirmLoading={submitLoading}
        centered
        destroyOnClose
        okText="保存"
        title={title}
        visible={visible}
        width={940}
        wrapClassName="ResourceInstanceSchema__modal"
        onCancel={cancel}
        onOk={submit}
      >
        <a-spin spinning={spinning}>
          {
            h(title === '新增' ? Add : Edit, {
              props: {
                attributeList,
                relationAttributeList,
                instance,
                loading: spinning
              },
              ref: 'form'
            })
          }
        </a-spin>
      </a-modal>
    )
  }
}
</script>

<style lang="less">
.ResourceInstanceSchema__modal {
  .ant-modal-body {
    padding-top: 0;
  }
  .ant-tabs-tabpane {
    padding-top: 0;
    height: 508px;
    overflow-y: auto;
  }
  .ant-transfer {
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .ant-transfer-operation {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ant-transfer-list {
    height: 400px;
    flex: 1;
  }
}
</style>
