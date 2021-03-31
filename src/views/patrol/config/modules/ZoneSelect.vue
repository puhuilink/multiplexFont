<template>
  <div class="ZoneSelect">
    <div class="ZoneSelect__header">
      <a-radio-group
        class="ZoneSelect__path"
        button-style="solid"
        :value="options.pathId"
        @input="changePathId"
      >
        <a-radio-button v-for="{ pathId, pathName } in pathList" :key="pathId" :value="pathId">
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
    </a-tabs>

  </div>
</template>

<script>
import { GroupService } from '@/api/index'
import _ from 'lodash'

export default {
  name: 'ZoneSelect',
  mixins: [],
  components: {},
  props: {},
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
    changePathId (pathId) {
      const { pathList, options } = this
      const path = pathList.find((path) => pathId === path.pathId)
      Object.assign(options, {
        pathId: _.get(path, ['pathId']),
        zoneId: _.get(path, ['zoneList', '0', 'id'])
      })
    },
    async fetch () {
      return GroupService
        .find({
          where: {
            is_patrol: true
          },
          fields: [
            'groupName: group_name',
            `patrolPath {
              id
              zoneRelationList {
                zone {
                  id
                  alias
                }
              }
            }`
          ],
          alias: 'groupList'
        })
        .then(({ data: { groupList } }) => {
          // 一个工作组之多只能配置一条巡更路线
          const pathList = groupList.map(({ groupName, patrolPath }) => {
            return {
              // 以工作组名称区分巡更路线
              pathName: groupName,
              pathId: patrolPath?.id,
              zoneList: patrolPath?.zoneRelationList?.map(({ zone }) => ({ ...zone })) || []
            }
          })

          // 未配置路线的工作组置后
          this.pathList = _.orderBy(pathList, (e) => e.zoneList.length, ['desc'])
        })
        .catch((err) => {
          this.pathList = []
          throw err
        })
    }
  },
  async created () {
    await this.fetch()
    // 默认选中第一条路线第一个区域
    const { pathList, options } = this
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
