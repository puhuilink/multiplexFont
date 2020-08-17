<template>
  <div class="index">
    <a-row>
      <a-col :span="6">
        <CmdbTree
          class="TreeNavigation__cmdb-tree"
          @select="onSelect"
        />
      </a-col>

      <a-col :span="18">
        <PerformanceList
          class="TreeNavigation__performance-list"
          :where="where"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { CmdbTree } from '@/components/Cmdb'
import PerformanceList from '@/components/Performance/List'

export default {
  name: 'TreeNavigation',
  mixins: [],
  components: {
    CmdbTree,
    PerformanceList
  },
  props: {},
  data: () => ({
    where: {}
  }),
  computed: {},
  methods: {
    onSelect (selectedKeys = [], { selected, node: { dataRef } }) {
      this.where = {
        ...selected ? {
          host_id: dataRef.id
        } : {}
      }
    }
  }
}
</script>

<style lang="less">
.TreeNavigation {
  &__cmdb-tree {
    margin: 0 4px;
    height: calc(100vh - 120px);
    overflow: auto;
  }

  &__performance-list {
    margin: 0 4px;
    overflow: auto;
  }
}
</style>
