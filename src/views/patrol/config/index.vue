<template>
  <div class="PatrolConfig">
    <div class="PatrolConfig__header">
      <ZoneSelect @change="changeZone" />
    </div>
    <a-spin :spinning="spinning">

      <div class="PatrolConfig__content">
        <div class="PatrolConfig__table">

          <div class="PatrolConfig__thead border-bottom text-center">
            <div class="PatrolConfig__th border-right checkbox">
              <a-checkbox></a-checkbox>
            </div>
            <div class="PatrolConfig__th border-right index"><span>序号</span></div>
            <div class="PatrolConfig__th border-right checkpoints__with-scroll"><span>点位</span></div>
            <div class="PatrolConfig__th border-right qrCode"><span>二维码</span></div>
            <div class="PatrolConfig__th border-right hosts"><span>监控对象</span></div>
            <div class="PatrolConfig__th border-right endpoints"><span>监控实体</span></div>
            <div class="PatrolConfig__th border-right metrics"><span>检查项</span></div>
            <div class="PatrolConfig__th operations__with-scroll"><span>操作</span></div>
          </div>

          <div class="PatrolConfig__tbody" ref="tBody">

            <!-- / Checkpoints -->
            <div
              class="PatrolConfig__tr"
              v-for="({ checkpointId, checkpointAlias, hosts }, index) in checkpoints"
              :key="checkpointId"
            >
              <div class="display-flex justify-content-center align-items-center checkbox border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <a-checkbox ref="checkbox" @change="onCheckBox(checkpointId)"></a-checkbox>
              </div>
              <div class="display-flex justify-content-center align-items-center flex-row index border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <span>{{ index + 1 + offset }}</span>
              </div>
              <div class="display-flex justify-content-center align-items-center flex-row checkpoints border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <span>{{ checkpointAlias }}</span>
              </div>
              <div class="display-flex justify-content-center align-items-center flex-row qrCode border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <a-spin spinning v-if="qcCodeLoading[checkpointId]" />
                <a-button v-else type="link" @click="qrCodeDownload(checkpointId)">下载</a-button>
              </div>

              <!-- / Hosts -->
              <div class="flex-1 flex-row">
                <div
                  class="display-flex flex-row"
                  v-for="({ hostId, hostAlias, endpoints }, hostIndex) in hosts"
                  :key="hostId"
                >
                  <div class="hosts border-right border-bottom PatrolConfig__td" :class="{ 'border-top': hostIndex === 0 && index === 0 }">
                    <span>{{ hostAlias }}</span>
                  </div>

                  <!-- / Endpoints -->
                  <div class="flex-1">
                    <div
                      class="display-flex flex-row align-items-center justify-content-center"
                      v-for="({ endpointId, endpointAlias, metrics }, endpointIndex) in endpoints"
                      :key="endpointId"
                    >
                      <div
                        class="endpoints border-right border-bottom PatrolConfig__td"
                        :class="{ 'border-top': hostIndex === 0 && index === 0 && endpointIndex === 0 }"
                        :style="{
                          minHeight: (metrics.length || 1) * 40 + 'px'
                        }"
                      >
                        <span>{{ endpointAlias }}</span>
                      </div>

                      <!-- / Metrics -->
                      <div class="metrics PatrolConfig__td">
                        <div
                          class="fw"
                          v-for="({ metricId, metricAlias }, metricIndex) in metrics"
                          :key="metricId"
                        >
                          <div
                            class="border-right border-bottom display-flex justify-content-center align-items-center"
                            :class="{ 'border-top': hostIndex === 0 && index === 0 && endpointIndex === 0 && metricIndex === 0 }"
                            :style="{
                              height: '40px'
                            }"
                          >
                            <span>{{ metricAlias }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="PatrolConfig__td display-flex flex-row operations border-bottom" :class="{ 'border-top': index === 0 }">
                    <a-button type="link" @click.prevent.stop="infoEdit(checkpointAlias,hostAlias)">编辑</a-button>
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
      :visible.sync="visible"
      :xgModelPoint="xgModelPoint"
      v-if="visible"
    />

  </div>
</template>
<script>
import { PatrolService, PatrolConfigService } from '@/api'
import Timeout from 'await-timeout'
import { Confirm, List } from '@/components/Mixins'
import { downloadFile, scrollTo } from '@/utils/util'
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
      disableBtn: true,
      checkpoints: [],
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
          throw err
        })
        .finally(() => {
          this.$nextTick(() => {
            scrollTo(0, { getContainer: () => this.$refs.tBody })
          })
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
  @import url('./layout.less');
</style>
