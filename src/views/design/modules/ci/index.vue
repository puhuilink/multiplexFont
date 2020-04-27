<template>
  <ResourceTree
    instanceList
    hiddenTab
    draggable
    :rootKeys="['CommonCi']"
    @dragstart="dragstart"
    @dragend="dragend"
  />
</template>

<script>
import { ResourceTree } from '@/components/Resource'
import { ViewDesignService } from '@/api-hasura'

export default {
  name: 'Ci',
  components: {
    ResourceTree
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    dragstart ({ event, node }) {
      const { dataRef } = node
      // 只允许拖动 ci 节点
      dataRef.__typename !== 'ngecc_instance' && event.preventDefault()
    },
    dragend ({ event, node }) {
      // TODO: 拖拽到拓扑区域后再调取接口
      const { dataRef } = node
      this.fetch(dataRef)
    },
    async fetch ({ name_s }) {
      const data = await ViewDesignService.nodeByCi(name_s)
      console.log(data)
    }
  }
}
</script>

<style lang="less">

</style>
