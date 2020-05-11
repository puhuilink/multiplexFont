<script>
import Common from './Common'
import CiPointInList from './modules/CiPointInList'
import CiTopologicalGraph from './modules/CiTopologicalGraph'
import _ from 'lodash'

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
  methods: {
    renderTabPaneTopologicalGraph () {
      const {
        hasTopologicalGraph,
        instance
      } = this
      return !hasTopologicalGraph ? null : (
        <a-tab-pane tab="关系拓扑图" key="topologicalGraph">
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
        <a-tab-pane tab="指入关系" key="pointIn">
          <CiPointInList
            pointInInstanceList={instance.pointInInstanceList}
          />
        </a-tab-pane>
      )
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
