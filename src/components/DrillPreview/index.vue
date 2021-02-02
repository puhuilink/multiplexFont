<template>
  <div class="DrillPreview">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Tab 1" v-if="viewConfig.alarm">
        <div class="container">
          <Renderer ref="alarmRenderer" :view="viewConfig.alarm" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2" v-if="viewConfig.template">
        <div class="container">
          <Renderer :view="viewConfig.template" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Renderer from '~~~/Renderer'
import { ViewDesignService } from '@/api/index'

export default {
  name: 'DrillPreview',
  mixins: [],
  provide: {
    externalHostId: '17668655076741344'
  },
  components: {
    Renderer
  },
  props: {},
  data: () => ({
    viewConfig: {
      alarm: null,
      template: null
    }
  }),
  computed: {},
  methods: {

  },
  async created () {
    const [template, alarm] = await Promise.all([
      ViewDesignService.getDesign({ view_id: 8947 }),
      ViewDesignService.getDesign({ view_id: 8777 })
    ])
    Object.assign(this.viewConfig, {
      template, alarm
    })
    console.log(this)
  }
}
</script>

<style lang="less">
.container {
  width: 100%;
  height: calc(100vh - 110px);
}
</style>
