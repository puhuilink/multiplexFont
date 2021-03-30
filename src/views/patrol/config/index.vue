<template>
  <div class="PatrolConfig">
    <div class="PatrolConfig__header">
      <ZoneSelect @change="changeZone" />
    </div>
    <a-spin :spinning="spinning">

      <div class="PatrolConfig__content">
        <div class="PatrolConfig__table">

          <div class="PatrolConfig__thead bb">
            <div class="PatrolConfig__th br checkbox">
              <a-checkbox></a-checkbox>
            </div>
            <div class="PatrolConfig__th br index">序号</div>
            <div class="PatrolConfig__th br checkpoints">点位</div>
            <div class="PatrolConfig__th br qrCode">二维码</div>
            <div class="PatrolConfig__th br hosts">监控对象</div>
            <div class="PatrolConfig__th br endpoints">监控实体</div>
            <div class="PatrolConfig__th br metrics">检查项</div>
            <div class="PatrolConfig__th operations">操作</div>
          </div>

          <div class="PatrolConfig__tbody">
            <div
              class="PatrolConfig__tr"
              v-for="({ checkpointId, checkpointAlias, hosts }, index) in checkpoints"
              :key="checkpointId"
            >
              <div class="countCheck checkbox br bb" :class="{ bt: index === 0 }">
                <span>
                  <a-checkbox ref="checkbox" @change="onCheckBox(checkpointId)"></a-checkbox>
                </span>
              </div>
              <div class="countDiv1 index br bb" :class="{ bt: index === 0 }">
                <span>{{ index + offset }}</span>
              </div>
              <div class="countDiv1 checkpoints br bb" :class="{ bt: index === 0 }">
                <span>{{ checkpointAlias }}</span>
              </div>
              <div class="countDiv1 qrCode br bb" :class="{ bt: index === 0 }">
                <a-spin spinning v-if="qcCodeLoading[checkpointId]" />
                <a-button v-else type="link" @click="qrCodeDownload(checkpointId)">下载</a-button>
              </div>

              <div class="countDiv2">
                <div
                  class="countDiv3"
                  v-for="({ hostId, hostAlias, endpoints }, hostIndex) in hosts"
                  :key="hostId"
                >
                  <div class="countDiv3-div hosts br bb" :class="{ bt: hostIndex === 0 && index === 0 }">{{ hostAlias }}</div>
                  <div class="countDiv4">
                    <div
                      class="countDiv5"
                      v-for="({ endpointId, endpointAlias, metrics }, endpointIndex) in endpoints"
                      :key="endpointId"
                    >
                      <div class="countDiv5-div endpoints br bb df ac jc" :class="{ bt: hostIndex === 0 && index === 0 && endpointIndex === 0 }">
                        <span>{{ endpointAlias }}</span>
                      </div>
                      <div class="countDiv5-div metrics df ac jc flex-column" :style="{ minHeight: '66px' }">
                        <div
                          class="fw"
                          v-for="({ metricId, metricAlias }, metricIndex) in metrics"
                          :key="metricId"
                        >
                          <div
                            class="br bb df jc ac"
                            :class="{ bt: hostIndex === 0 && index === 0 && endpointIndex === 0 && metricIndex === 0 }"
                            :style="{
                              minHeight: [0, 1].includes(metrics.length) ? '66px' : '33px'
                            }"
                          >
                            <span>{{ metricAlias }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="PatrolConfig__td operations bb" :class="{ bt: index === 0 }">
                    <a-button type="link" @click="infoEdit(checkpointAlias,hostAlias)">编辑</a-button>
                    <a-button type="link">删除</a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ant-pagination mini ant-table-pagination">
          <a-pagination
            :defaultPageSize="5"
            :pageSize.sync="pagination.pageSize"
            :pageSizeOptions="['5', '10', '15']"
            size="small"
            showQuickJumper
            showSizeChanger
            :showTotal="(total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`"
            :total="pagination.total"
            @change="changePagination"
            @showSizeChange="changePagination"
          />
        </div>
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
import { PatrolService, PatrolConfigService } from '@/api'
import Timeout from 'await-timeout'
import { Confirm, List } from '@/components/Mixins'
import { downloadFile } from '@/utils/util'
import HostSchema from './modules/HostSchema.vue'
import ZoneSelect from './modules/ZoneSelect'

export default {
  name: 'PatrolConfig',
  mixins: [Confirm, List],
  props: {},
  components: {
    HostSchema,
    ZoneSelect
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
      pagination: {
        pageNo: 1,
        pageSize: 5,
        total: 0
      },
      xgModelPoint: ''
    }
  },
  computed: {
    offset () {
      const { pageNo, pageSize } = this.pagination
      return (pageNo - 1) * pageSize
    }
  },
  methods: {
    changeZone ({ pathId, zoneId }) {
      Object.assign(this, { pathId, zoneId })
      this.resetPagination()
      this.loadPatrolConfig()
    },

    loadPatrolConfig () {
      const { pathId, zoneId, pagination } = this
      const { pageNo = 1, pageSize = 5 } = pagination

      if (!pathId || !zoneId) {
        return
      }

      this.spinning = true
      return PatrolConfigService
        .patrolConfig({
          pathId,
          zoneId,
          limit: pageSize,
          offset: (pageNo - 1) * pageSize
        })
        .then(({ data, pagination }) => {
          this.checkpoints = data
          this.pagination.total = pagination.aggregate.count
        })
        .catch((err) => {
          this.checkpoints = []
          this.resetPagination()
          this.$notifyError(err)
          throw err
        })
        .finally(() => {
          this.spinning = false
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

    changePagination (pageNo, pageSize) {
      Object.assign(this.pagination, { pageNo, pageSize })
      this.loadPatrolConfig()
    },

    resetPagination () {
      Object.assign(
        this.pagination,
        this.$options.data.apply(this).pagination
      )
    },

    onCheckBox (e) {
      this.disableBtn = !true
      console.log('11', this.$refs.checkbox)
    }

  }
}
</script>

<style lang="less">
  @import url('./index.less');
  @import url('./utils.less');
  @import url('./table.less');
</style>
