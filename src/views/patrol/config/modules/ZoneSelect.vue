
<template>
  <div class="ZoneSelect">
    <!-- eslint-disable -->
    <div class="ZoneSelect__header">
      <a-radio-group
        class="ZoneSelect__path"
        button-style="solid"
        :value="options.pathId"
        @input="changePathId"
      >
        <a-radio-button
          v-for="
            { pathId, pathName } in pathList"
          :key="pathId"
          :value="pathId">
          {{ pathName }}
        </a-radio-button>
      </a-radio-group>

      <slot name="default"></slot>
    </div>

    <a-tabs
      class="ZoneSelect__zone"
      :key="pathId"
      type="card"
      v-for="({ pathId, zoneList }) in pathList"
      v-show="pathId === options.pathId"
      v-model="options.zoneId"
    >
      <a-tab-pane v-for="({ id, alias }) in zoneList" :key="id" :tab="alias"></a-tab-pane>
      <a-button slot="tabBarExtraContent" style='margin-right: 30px;margin-bottom: 5px' @click="createNewZone">
        <a-icon type="plus" style='color: gray'/>
        新建楼层
      </a-button>
    </a-tabs>

  </div>
</template>

<script>
import { PathService } from '@/api/index'
import _ from 'lodash'

export default {
  name: 'ZoneSelect',
  mixins: [],
  components: {},
  props: {
    pathId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pathList: [],
      options: {
        pathId: null,
        zoneId: null
      }
    }
  },
  computed: {},
  watch: {
    options: {
      deep: true,
      handler (options) {
        this.$emit('change', options)
      }
    }
  },
  methods: {
    createNewZone () {
      this.$emit('new')
    },
    changePathId (pathId) {
      const { pathList, options } = this
      const path = pathList.find((path) => pathId === path.pathId)
      Object.assign(options, {
        pathId: _.get(path, ['pathId']),
        zoneId: _.get(path, ['zoneList', '0', 'id'])
      })
    },
    async fetch () {
      const { zones, list } = await PathService.getPathList(this.pathId)
      const path = {
        pathName: list[0].pathAlias,
        pathId: list[0].pathId,
        zoneList: zones.map((z) => {
          return {
            id: z.zoneId,
            alias: z.alias
          }
        })
      }
      this.pathList = [path]
    }
  },
  async created () {
    await this.fetch()
    // 默认选中第一条路线第一个区域
    const { pathList, options } = this
    console.log(this.pathList)
    Object.assign(options, {
      pathId: _.get(pathList, ['0', 'pathId']),
      zoneId: _.get(pathList, ['0', 'zoneList', '0', 'id'])
    })
  }
}
</script>

<style lang="less">
.ZoneSelect {
  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 8px;
  }

  &__path {}

  &__zone {
    margin: 8px 0 -10px 0;
  }
}
</style>
