<script>
import Common from './Common'

export default {
  name: 'Add',
  mixins: [Common],
  render (h) {
    const {
      form,
      renderTabPaneBase,
      renderTabPaneRelation,
      renderTabPaneOther
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

        </a-tabs>
      </a-form>
    )
  }
}
</script>

<style lang="less">

</style>
