<template>
  <div class="PatrolConfig">
    <a-spin :spinning="spinning">
      <!-- / 工作组 -->
      <div class="PatrolConfig__header">
        <div>
          <a-radio-group v-model="selectedGroupId" default-value="group_id" button-style="solid">
            <a-radio-button v-for="{ group_id, group_name } in groupList" :key="group_id" :value="group_id">
              {{ group_name }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div>
          <div class="PatrolConfig__header__search">
            <a-input class="PatrolConfig__header__search__input" allowClear v-model.trim="searchIinput" />
            <a-button type="primary"> 查询 </a-button>
          </div>
        </div>
        <div>
          <div class="PatrolConfig__header__addFun">
            <div>
              <a-button class="PatrolConfig__header__search__input" type="primary">新增监控对象</a-button>
            </div>
            <div>
              <a-button type="primary"> 下载 </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- :pagination="false" -->
      <div class="PatrolConfig__content">
        <a-tabs type="card">
          <a-tab-pane size="default" v-for="{ alias, id } in floorList" :key="id" :tab="alias">
            <a-table :columns="columns" :data-source="dataLIstone" bordered>
              <template slot="name" slot-scope="text">
                <a>{{ text }}</a>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { GroupService, PatrolService, PatrolConfigService } from '@/api'
import _ from 'lodash'
import { Confirm, List } from '@/components/Mixins'

export default {
  name: 'PatrolConfig',
  mixins: [Confirm, List],
  components: {},
  props: {},
  data () {
    return {
      columns: [],
      dataLIstone: [],
      dataSource: [],
      floorTabIndex: 0,
      floorList: [],
      groupList: [],
      selectedGroupId: null,
      spinning: false,
      dataList: [],
      searchIinput: ''
    }
  },
  computed: {
    colSpanMap: function () {
      return this.getColSpanByKeys(this.dataLIstone)
    }
  },
  methods: {
    /**
     * 加载巡更组列表
     */
    async loadGroupList () {
      try {
        this.spinning = true
        const {
          data: { groupList }
        } = await GroupService.find({
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
        const {
          data: { pathList }
        } = await PatrolService.pathFind({
          // where: { group_id },
          // TODO: 工作组未完全录入
          where: { group_id: 'patrolgroup-xmenv' },
          fields: ['floorList { alias id }'],
          alias: 'pathList'
        })
        const floorList = _.get(_.first(pathList), 'floorList')
        this.floorList = floorList
      } catch (e) {
        this.floorList = []
        throw e
      }
    },

    // 加载表格数据回调
    loadData (parameter) {
      Promise.all([
        new Promise((resolve, reject) => {
          return PatrolConfigService.dataSource().then((data) => {
            const zone = _.first(data)
            const tempList = this.setForLoop(zone)
            resolve(tempList)
          })
        })
      ]).then((res) => {
        console.log('res', res)
        this.dataLIstone = res[0]
      })
    },
    setForLoop (zone) {
      const checkpointsList = []
      zone.checkpoints.forEach((checkpointId) => {
        checkpointId.hosts.forEach((hostId) => {
          hostId.endpoints.forEach((endpointId) => {
            endpointId.metrics.forEach((foodVal) => {
              checkpointsList.push({
                checkpointId: checkpointId.checkpointId,
                hostId: hostId.hostId,
                endpointId: endpointId.endpointId,
                answerId: foodVal.answerId,
                metricId: foodVal.metricId
              })
            })
          })
        })
      })
      return checkpointsList
    }

    // getColSpanByKeys (dataSource) {
    //   const colSpanMap = new Map()
    //   if (dataSource.lenght > 0) {
    //     Object.keys(dataSource[0]).forEach((key) => {
    //       colSpanMap.set(key, this.getColSpan(dataSource, key))
    //     })
    //   }
    //   return colSpanMap
    // },

    // getColSpan (data, key) {
    //   const colSpan = [1]
    //   for (let i = 1, j = 2; i < data.length; i++, j++) {
    //     const prev = data[i - 1][key]
    //     const curr = data[i][key]
    //     if (prev == curr) {
    //       colSpan[i - 1] = 0
    //     } else {
    //       j = 1
    //     }
    //     colSpan.push(j)
    //   }

    //   for (let i = colSpan.length - 1, j = colSpan.length - 1; i >= 0; i--) {
    //     if (colSpan[i - 1] != 0) {
    //       ;[colSpan[j], colSpan[i]] = [colSpan[i], colSpan[j]]
    //       if (i != 0) {
    //         j = i - 1
    //       }
    //     }
    //   }

    //   return colSpan
    // }
  },
  async created () {
    await this.loadGroupList()
    await this.loadPathConfig()
    await this.loadData()
    this.columns = [
      {
        title: '序号',
        width: 150,
        dataIndex: 'id',
        customRender: (text, record, index) => index + 1
      },
      {
        title: '点位',
        dataIndex: 'checkpointId',
        width: 200
        // customRender: (text, record, index) => {
        //   const colSpanList = this.colSpanMap.get('checkpointId')
        //   console.log('xz111', colSpanList)
        //   return {
        //     children: text,
        //     attrs: { rowSpan: colSpanList[index] },
        //   }
        // },
      },
      {
        title: '二维码',
        dataIndex: '',
        width: 150,
        customRender: (text, record) => <a-button type="link">下载</a-button>
      },
      {
        title: '监控对象',
        dataIndex: 'hostId',
        width: 150
        // customRender: (text, record, index) => {
        //   const colSpanList = this.colSpanMap.get('hostId')
        //   return {
        //     children: text,
        //     attrs: { rowSpan: colSpanList[index] },
        //   }
        // },
      },
      {
        title: '监控实体',
        dataIndex: 'endpointId',
        width: 150
        // customRender: (text, record, index) => {
        //   const colSpanList = this.colSpanMap.get('endpointId')
        //   return {
        //     children: text,
        //     attrs: { rowSpan: colSpanList[index] },
        //   }
        // },
      },
      {
        title: '检查项',
        dataIndex: 'metricId',
        width: 150
        // customRender: (text, record, index) => {
        //   const colSpanList = this.colSpanMap.get('metricId')
        //   return {
        //     children: text,
        //     attrs: { rowSpan: colSpanList[index] },
        //   }
        // },
      }
    ]
  },
  mounted () {}
}
</script>

<style lang="less">
.PatrolConfig {
  &__header {
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    &__search {
      display: flex;
      &__input {
        margin-right: 6px;
      }
    }
    &__addFun {
      display: flex;
    }
  }
}
</style>
