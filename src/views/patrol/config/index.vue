<template>
  <div class="PatrolConfig">
    <a-spin :spinning="spinning">
      <!-- / 工作组 -->
      <div class="PatrolConfig__header">
        <div>
          <a-radio-group v-model="groupId" default-value="group_id" button-style="solid">
            <a-radio-button v-for="{ group_id, group_name } in groupList" :key="group_id" :value="group_id">
              {{ group_name }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="PatrolConfig__header__search">
          <a-input class="PatrolConfig__header__search__input" allowClear v-model.trim="searchInput" />
          <a-button type="primary">查询</a-button>
        </div>
        <div>
          <div class="PatrolConfig__header__addFun">
            <!-- <div>
              <a-button
                :disabled="disableBtn"
                @click="addTableLists"
                class="PatrolConfig__header__search__input"
                type="primary"
                >新增监控对象</a-button
              >
            </div> -->
            <div>
              <a-button type="primary">下载</a-button>
            </div>
          </div>
        </div>
      </div>

      <div class="PatrolConfig__content">
        <a-tabs @change="changeZone">
          <a-tab-pane v-for="{ alias, id } in zoneList" :key="id" :tab="alias">
            <div class="box">
              <div class="PatrolConfig__thead">
                <div class="PatrolConfig__th">点位</div>
                <div class="PatrolConfig__th">二维码</div>
                <div class="PatrolConfig__th">监控对象</div>
                <div class="PatrolConfig__th">监控实体</div>
                <div class="PatrolConfig__th">检查项</div>
                <div class="PatrolConfig__th">操作</div>
              </div>
              <div>
                <div
                  class="tableCount"
                  v-for="{ checkpointId, checkpointAlias, hosts } in checkpoints"
                  :key="checkpointId"
                >
                  <div class="countCheck">
                    <span>
                      <a-checkbox ref="checkbox" @change="onCheckBox(checkpointId)"></a-checkbox>
                    </span>
                  </div>
                  <div class="countDiv1">
                    <span>{{ checkpointAlias }}</span>
                  </div>
                  <div class="countDiv1">
                    <a-spin spinning v-if="qcCodeLoading[checkpointId]" />
                    <a-button v-else type="link" @click="qrCodeDownload(checkpointId)">下载</a-button>
                  </div>

                  <div class="countDiv2">
                    <div
                      class="countDiv3"
                      v-for="({ hostId, hostAlias, endpoints }) in hosts"
                      :key="hostId"
                    >
                      <div class="countDiv3-div">{{ hostAlias }}</div>
                      <div class="countDiv4">
                        <div
                          class="countDiv5"
                          v-for="{ endpointId, endpointAlias, metrics } in endpoints"
                          :key="endpointId"
                        >
                          <div class="countDiv5-div">
                            <span>{{ endpointAlias }}</span>
                          </div>
                          <div class="countDiv5-div">
                            <div
                              class="countDiv5Div-metricId"
                              v-for="{ metricId, metricAlias } in metrics"
                              :key="metricId"
                            >
                              <div>
                                <span>{{ metricAlias }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="textClick">
                        <a-button type="link" @click="infoEdit(checkpointAlias,hostAlias)">编辑</a-button>
                        <a-button type="link">删除</a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>

    <HostSchema
      :form.sync="form"
      :visible="visible"
      :xgModelPoint="xgModelPoint"
      v-if="visible"
    />

  </div>
</template>
<script>
import { GroupService, PatrolService, PatrolConfigService } from '@/api'
import Timeout from 'await-timeout'
import { Confirm, List } from '@/components/Mixins'
import { downloadFile } from '@/utils/util'
import HostSchema from './modules/HostSchema.vue'

export default {
  name: 'PatrolConfig',
  mixins: [Confirm, List],
  props: {},
  components: {
    HostSchema
  },
  data () {
    return {
      dataList: [],
      dataSource: [],
      disableBtn: true,
      checkpoints: [],
      floorTabIndex: 0,
      zoneList: [],
      groupList: [],
      qcCodeLoading: {},
      groupId: null,
      pathId: null,
      zoneId: null,
      spinning: false,
      searchInput: '',
      visible: false,
      form: {
        modalEndpointId: '',
        shareParams: [
          {
            modelMetrics: '',
            modalCheck: '',
            modalCheckValue: '',
            modalCheckId: '',
            modalWarning: '',
            modalAbnormal: '',
            modalWarningLevel: ''
          }
        ]
      },
      xgModelPoint: ''
    }
  },
  methods: {
    /**
    * 加载巡更组列表
    */
    loadGroupList () {
      return GroupService
        .find({
          where: { is_patrol: true },
          fields: ['group_id', 'group_name'],
          alias: 'groupList'
        })
        .then(({ data: { groupList } }) => groupList)
        .then((groupList) => {
          this.groupList = groupList
          // FIXME: 工作组未完全录入
          // this.groupId = _.get(_.first(groupList), 'group_id')
          this.groupId = 'patrolgroup-xmenv'
        })
        .catch((err) => {
          this.groupList = []
          this.groupId = null
          this.$notifyError(err)
          throw err
        })
    },

    /**
    * 加载巡更组下路线配置
    */
    loadPathConfig () {
      return PatrolService
        .pathFind({
          where: { group_id: this.groupId },
          fields: [
            'id',
            'zoneList: floorList { alias id }'
          ],
          alias: 'pathList'
        })
        .then(({ data: { pathList } }) => pathList)
        .then(([path]) => {
          this.pathId = path.id
          this.zoneList = path.zoneList
          this.zoneId = this.zoneList[0].id
        })
        .catch((err) => {
          this.pathId = null
          this.zoneList = []
          this.zoneId = null
          this.$notifyError(err)
          throw err
        })
    },

    loadPatrolConfig (parameter) {
      return PatrolConfigService
        .patrolConfig({
          pathId: this.pathId,
          zoneId: this.zoneId
        })
        .then(({ data }) => {
          this.checkpoints = data
        })
        .catch((err) => {
          this.$notifyError(err)
          throw err
        })
    },

    // 点击编辑
    infoEdit (pointsId, alias) {
      console.log('11', pointsId)
      console.log('222', alias)
      this.visible = true
      this.xgModelPoint = pointsId
      this.form.modalEndpointId = alias
    },

    changeZone (zoneId) {
      this.loadPatrolConfig({ zoneId })
    },

    qrCodeDownload (code) {
      this.$set(this.qcCodeLoading, code, true)
      return PatrolService
        .qrCode(code)
        .then(async (res) => {
          downloadFile(`二维码-${code}.png`, new Uint8Array(res))
          await Timeout.set(300)
        })
        .finally(() => {
          this.$set(this.qcCodeLoading, code, false)
        })
    },

    onCheckBox (e) {
      this.disableBtn = !true
      console.log('11', this.$refs.checkbox)
    }

  },

  async created () {
    try {
      this.spinning = true
      await this.loadGroupList()
      await this.loadPathConfig()
      await this.loadPatrolConfig()
    } finally {
      this.spinning = false
    }
  }
}
</script>

<style lang="less">
  @import url('./index.less');
</style>
