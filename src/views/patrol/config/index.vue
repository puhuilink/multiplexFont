<template>
  <div class="PatrolConfig">
    <a-spin :spinning="spinning">

      <!-- / 工作组 -->
      <div class="PatrolConfig__header">
        <a-radio-group v-model="selectedGroupId">
          <a-radio-button v-for="{ group_id, group_name } in groupList" :key="group_id" :value="group_id">
            {{ group_name }}
          </a-radio-button>
        </a-radio-group>
      </div>

      <!-- / 工作组下路线配置 -->
      <div class="PatrolConfig__content">
        <a-tabs type="card">
          <a-tab-pane v-for="{ alias, id } in floorList" :key="id" :tab="alias" >
            <a-table
              :rowKey="checkpoint => checkpoint.checkpointId"
              :columns="columns"
              :dataSource="dataSource"
            ></a-table>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- / 工作组下路线示意图 -->
      <div class="PatrolConfig__preview"></div>
    </a-spin>
  </div>
</template>

<script>
import { GroupService, PatrolConfigService, PatrolService } from '@/api-hasura'
import _ from 'lodash'

export default {
  name: 'PatrolConfig',
  mixins: [],
  components: {},
  props: {},
  data () {
    return {
      columns: Object.freeze([
        {
          title: '序号',
          width: 150,
          customRender: (text, record, index) => index
        },
        {
          title: '点位',
          dataIndex: 'id',
          width: 150
        },
        {
          title: '二维码',
          dataIndex: '',
          width: 150,
          customRender: (text, record) => <a-button type="link">下载</a-button>
        },
        {
          title: '监控对象',
          dataIndex: '',
          width: 150,
          customRender: (text, record) => record.hosts.map(({ hostId }) => hostId).join('/')
        }
        // {
        //   title: '监控实体',
        //   dataIndex: '',
        //   width: 150
        // },
        // {
        //   title: '检查项',
        //   dataIndex: '',
        //   width: 150
        // },
        // {
        //   title: '检查结果',
        //   dataIndex: '',
        //   width: 150
        // },
        // {
        //   title: '告警级别',
        //   dataIndex: '',
        //   width: 150
        // },
        // {
        //   title: '操作',
        //   dataIndex: '',
        //   width: 150
        // }
      ]),
      dataSource: [],
      floorTabIndex: 0,
      floorList: [],
      groupList: [],
      selectedGroupId: null,
      spinning: false
    }
  },
  computed: {
    selectedGroup: {
      get () {
        const { groupList, selectedGroupId } = this
        return groupList.find(({ group_id }) => group_id === selectedGroupId)
      }
    }
  },
  methods: {
    /**
     * 加载巡更组列表
     */
    async loadGroupList () {
      try {
        this.spinning = true
        const { data: { groupList } } = await GroupService.find({
          where: { is_patrol: true },
          fields: ['group_id', 'group_name'],
          alias: 'groupList'
        })
        this.groupList = groupList
        this.selectedGroupId = _.get(_.first(groupList), 'group_id')
      } catch (e) {
        this.groupList = []
        this.selectedGroupId = null
        throw e
      } finally {
        this.spinning = false
      }
    },
    /**
     * 加载巡更组下路线配置
     */
    async loadPathConfig (group_id = this.selectedGroupId) {
      try {
        const { data: { pathList } } = await PatrolService.pathFind({
          // where: { group_id },
          // TODO: 工作组未完全录入
          where: { group_id: 'patrolgroup-xmenv' },
          fields: [
            'floorList { alias id }'
          ],
          alias: 'pathList'
        })
        const floorList = _.get(_.first(pathList), 'floorList')
        this.floorList = floorList
      } catch (e) {
        this.floorList = []
        throw e
      }
    }
  },
  async created () {
    await this.loadGroupList()
    await this.loadPathConfig()
    // const checkpoints =
    await PatrolConfigService.dataSource()
    // this.dataSource = checkpoints
  }
}
</script>

<style lang="less">
.PatrolConfig {
  &__header {
    margin-bottom: 8px;
  }
}
</style>
