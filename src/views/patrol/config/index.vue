<template>
  <div class="PatrolConfig">
    <div class="PatrolConfig__header">
      <ZoneSelect @change="changeZone">
        <div class="PatrolConfig__operation">
          <a-input
            allowClear
            class="PatrolConfig__search"
            placeholder="搜索点位名称、监控对象"
          ></a-input>
          <a-button
            type="primary"
            @click="() => {
              changePagination(1, this.pagination.pageSize)
            }"
          >查询</a-button>
          <a-button type="primary">新增监控对象</a-button>
          <a-button
            :disabled="!hasSelected"
            :loading="qcCodeGlobalLoading"
            type="primary"
            @click="batchDownloadQrCode"
          >下载</a-button>
        </div>
      </ZoneSelect>
    </div>
    <a-spin :spinning="spinning">

      <div class="PatrolConfig__content">
        <div class="PatrolConfig__table">

          <div class="PatrolConfig__thead border-bottom text-center">
            <div class="PatrolConfig__th border-right checkbox">
              <a-checkbox
                :checked="hasSelectedAll && selectedRowKeys.length !== 0"
                :indeterminate="!hasSelectedAll && hasSelected"
                @change="toggleSelectAll"
              />
            </div>
            <div class="PatrolConfig__th border-right index"><span>序号</span></div>
            <div class="PatrolConfig__th border-right checkpoints"><span>点位</span></div>
            <div class="PatrolConfig__th border-right qrCode"><span>二维码</span></div>
            <div class="PatrolConfig__th border-right hosts"><span>监控对象</span></div>
            <div class="PatrolConfig__th border-right endpoints"><span>监控实体</span></div>
            <div class="PatrolConfig__th border-right metrics"><span>检查项</span></div>
            <div class="PatrolConfig__th operations operations__with-scroll"><span>操作</span></div>
          </div>

          <div class="PatrolConfig__tbody" ref="tBody">

            <!-- / Checkpoints -->
            <!-- hosts 可能为空，给定一条空数据用于占位 -->
            <div
              v-for="({ checkpointId, checkpointAlias, hosts = [{}] }, index) in checkpoints"
              class="PatrolConfig__tr checkpoint hover hover__primary-1"
              :class="{
                selected: selectedRowKeys.includes(checkpointId)
              }"
              :key="checkpointId"
            >
              <div class="d-flex j-c-center a-i-center checkbox border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <a-checkbox :checked="selectedRowKeys.includes(checkpointId)" @change="toggleSelect({ checkpointId, checkpointAlias, hosts })"></a-checkbox>
              </div>
              <div class="d-flex j-c-center a-i-center flex-row index border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <span>{{ index + 1 + offset }}</span>
              </div>
              <div class="d-flex j-c-center a-i-center flex-row checkpoints border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <span>{{ checkpointAlias }}</span>
              </div>
              <div class="d-flex j-c-center a-i-center flex-row qrCode border-right border-bottom" :class="{ 'border-top': index === 0 }">
                <a-spin spinning v-if="qcCodeLoading[checkpointId]" />
                <a-button v-else type="link" @click="downloadQrCode({ checkpointId, checkpointAlias})">下载</a-button>
              </div>

              <!-- / Hosts -->
              <!-- endpoints 可能为空，给定一条空数据用于占位 -->
              <div class="flex-row">
                <div
                  class="d-flex flex-row hover hover__primary-2"
                  v-for="({ hostId, hostAlias, endpoints = [{}] }, hostIndex) in hosts"
                  :key="hostId || hostIndex"
                >
                  <div class="hosts border-right border-bottom PatrolConfig__td" :class="{ 'border-top': hostIndex === 0 && index === 0 }">
                    <span>{{ hostAlias }}</span>
                  </div>

                  <!-- / Endpoints -->
                  <!-- metrics 可能为空，给定一条空数据用于占位 -->
                  <div class="flex-1">
                    <div
                      class="d-flex flex-row a-i-center j-c-center hover hover__primary-3"
                      v-for="({ endpointId, endpointAlias, metrics = [{}] }, endpointIndex) in endpoints"
                      :key="endpointId || endpointIndex"
                    >
                      <div
                        class="endpoints border-right border-bottom PatrolConfig__td"
                        :class="{ 'border-top': hostIndex === 0 && index === 0 && endpointIndex === 0 }"
                        :style="{
                          minHeight: (metrics.length || 1) * (device === 'desktop' ? 44 : 56) + 'px'
                        }"
                      >
                        <span>{{ endpointAlias }}</span>
                      </div>

                      <!-- / Metrics -->
                      <div class="metrics PatrolConfig__td">
                        <div
                          class="fw"
                          v-for="({ metricId, metricAlias }, metricIndex) in metrics"
                          :key="metricId || metricIndex"
                        >
                          <div
                            class="border-right border-bottom d-flex j-c-center a-i-center hover hover__primary-4"
                            :class="{ 'border-top': hostIndex === 0 && index === 0 && endpointIndex === 0 && metricIndex === 0 }"
                            :style="{
                              height: (device === 'desktop' ? 44 : 56) + 'px'
                            }"
                          >
                            <span>{{ metricAlias }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="PatrolConfig__td d-flex flex-row operations border-bottom" :class="{ 'border-top': index === 0 }">
                    <template v-if="hostId">
                      <a-button type="link" @click.prevent.stop="infoEdit(checkpointAlias,hostAlias)">编辑</a-button>
                      <a-button type="link">删除</a-button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a-empty v-show="checkpoints.length === 0" />
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
            v-model="pagination.pageNo"
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
import { Confirm, List } from '@/components/Mixins'
import { downloadFile, scrollTo } from '@/utils/util'
import HostSchema from './modules/HostSchema.vue'
import ZoneSelect from './modules/ZoneSelect'
import { mapState } from 'vuex'

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
      qcCodeGlobalLoading: false,
      qcCodeLoading: {},
      pathId: null,
      zoneId: null,
      selectedRowKeys: [],
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
    ...mapState({
      device: state => state.app.device
    }),
    hasSelectedAll () {
      const { selectedRowKeys, checkpoints } = this
      return selectedRowKeys.length === checkpoints.length
    },
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
      const { offset, pageSize: limit } = pagination

      if (!pathId || !zoneId) {
        this.checkpoints = []
        this.resetPagination()
        return
      }

      this.resetSelect()
      this.spinning = true
      return PatrolConfigService
        .patrolConfig({
          pathId,
          zoneId,
          limit,
          offset
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

    downloadQrCode ({ checkpointId, checkpointAlias }) {
      this.$set(this.qcCodeLoading, checkpointId, true)
      return PatrolService
        .qrCode(checkpointId)
        .then(async (res) => {
          await this.$nextTick()
          downloadFile(`${checkpointAlias}.png`, new Uint8Array(res))
        })
        .finally(() => {
          this.$set(this.qcCodeLoading, checkpointId, false)
        })
    },

    async batchDownloadQrCode () {
      try {
        this.qcCodeGlobalLoading = true
        await Promise.all(this.selectedRows.map((checkpoint) => {
          return this.downloadQrCode(checkpoint)
        }))
      } finally {
        this.qcCodeGlobalLoading = false
      }
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

    resetSelect () {
      Object.assign(this, {
        selectedRowKeys: [],
        selectedRows: []
      })
    },

    toggleSelect (checkpoint) {
      const { selectedRowKeys, selectedRows } = this
      const index = selectedRowKeys.indexOf(checkpoint.checkpointId)
      if (index !== -1) {
        selectedRowKeys.splice(index, 1)
        selectedRows.splice(index, 1)
      } else {
        selectedRowKeys.push(checkpoint.checkpointId)
        selectedRows.push(checkpoint)
      }
    },

    toggleSelectAll () {
      if (this.hasSelectedAll) {
        this.selectedRowKeys = []
        this.selectedRows = []
      } else {
        this.selectedRowKeys = this.checkpoints.map(({ checkpointId }) => checkpointId)
        this.selectedRows = this.checkpoints.slice()
      }
    }

  }
}
</script>

<style lang="less">
  @import url('./index.less');
  @import url('./utils.less');
  @import url('./layout.less');
</style>
