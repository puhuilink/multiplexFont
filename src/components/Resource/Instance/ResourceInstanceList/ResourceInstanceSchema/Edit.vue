<script>
import Common from './Common'
import CiPointInList from './modules/CiPointInList'
import CiTopologicalGraph from './modules/CiTopologicalGraph'
import _ from 'lodash'
import Timeout from 'await-timeout'

export default {
  name: 'Edit',
  mixins: [Common],
  props: {
    instance: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    mode: 'edit'
  }),
  computed: {
    hasPointIn () {
      const pointInLength = _.get(this, 'instance.pointOutInstanceList.length', 0)
      return !!pointInLength
    },
    hasTopologicalGraph () {
      const pointInLength = _.get(this, 'instance.pointOutInstanceList.length', 0)
      const pointOutLength = _.get(this, 'instance.pointInInstanceList.length', 0)
      // 至少存在两个点才构成一幅图
      return pointInLength + pointOutLength >= 2
    }
  },
  watch: {
    instance: {
      deep: true,
      async handler (v) {
        if (v) {
          // 等待 form 初始化
          await Timeout.set(300)
          const { form, attributeList, relationAttributeList } = this
          const keyList = [
            ...attributeList,
            ...relationAttributeList
          ].map(({ name }) => name)
          // console.log(_.pick({ ...v, ...v.values }, keyList))
          form.setFieldsValue(_.pick({ ...v, ...v.values }, keyList))
        }
      }
    }
  },
  methods: {
    renderTabPaneTopologicalGraph () {
      const {
        hasTopologicalGraph,
        instance
      } = this
      return !hasTopologicalGraph ? null : (
        <a-tab-pane tab="关系拓扑图" key="topologicalGraph" forceRender>
          <CiTopologicalGraph
            instance={instance}
          />
        </a-tab-pane>
      )
    },
    renderTabPanePointIn () {
      const {
        hasPointIn,
        instance
      } = this
      return !hasPointIn ? null : (
        <a-tab-pane tab="指入关系" key="pointIn" forceRender>
          <CiPointInList
            pointInInstanceList={instance.pointInInstanceList}
          />
        </a-tab-pane>
      )
    },
    submit (cb = () => {}) {
      this.form.validateFieldsAndScroll(cb)
    }
  },
  render (h) {
    const {
      form,
      renderTabPaneBase,
      renderTabPaneRelation,
      renderTabPaneOther,
      renderTabPaneTopologicalGraph,
      renderTabPanePointIn
    } = this

    return (
      <a-form
        form={form}
        layout="vertical"
      >
        <a-tabs defaultActiveKey="base">

          { renderTabPaneBase() }

          { renderTabPaneRelation() }

          { renderTabPaneOther() }

          { renderTabPanePointIn() }

          { renderTabPaneTopologicalGraph() }

        </a-tabs>
      </a-form>
    )
  }
}
</script>

<style lang="less">

</style>
