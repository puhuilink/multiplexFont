<template>
  <div class="PatrolConfig">
    <div class="PatrolConfig__header">
      <ZoneSelect @change="changeZone">
        <div class="PatrolConfig__operation">
          <a-form class="d-flex flex-row">
            <a-input
              allowClear
              class="PatrolConfig__search"
              placeholder="搜索点位名称"
              :style="{
                'margin-right': '12px'
              }"
              v-model.trim="queryParams.alias"
            ></a-input>
            <a-button
              type="primary"
              htmlType="submit"
              @click="() => {
                changePagination(1, this.pagination.pageSize)
              }"
            >查询</a-button>
          </a-form>
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
    <a-table
      ref="table"
      :columns="columns"
      :data-source="data"
      :row-key="record => record.index"
      bordered
      :loadind="spinning"
      :pagination="{
        current: table.pageNumber,
        defaultPageSize: 10,
        showTotal: (total,range)=> `${range[0]}-${range[1]}共${total}个检查项`,
        onChange:(pageNumber) =>{
          table.pageNumber = pageNumber
          this.checkpoints = []
          this.hostTable = []
          this.endpointTable = []
        }
      }"
    >
      <template slot="checkboxes">
        <a-checkbox
          :checked="hasSelectedAll"
          :indeterminate="hasSelectedOne"
          @change="onSelectGroupChange"
        />
      </template>
      <template slot="checkbox" slot-scope="value,row">
        <a-checkbox
          :checked="isChecked(row.checkpoint_id)"
          @change="onSelectChange(row.checkpoint_id)"
        />
      </template>
      <template slot="endpoint" slot-scope="value">
        {{ value!=='NULL'?value:'虚拟实体' }}
      </template>
      <template slot="code" slot-scope="value,row">
        <a
          @click="downloadQrCode({ checkpointId: row.checkpoint_id, checkpointAlias: row.checkpoint_alias })"
        >
          下载
        </a>
      </template>
      <template slot="action" slot-scope="value,row">
        <a-button
          type="primary"
          @click="infoEdit(row.checkpoint_id, row.checkpoint_alias, row.host_id)"
        >
          编辑
        </a-button>
        <a-divider type="vertical"/>
        <a-button
          type="primary"
          @click="deleteHost()"
        >
          删除
        </a-button>
      </template>
    </a-table>
    <HostSchema
      :form.sync="form"
      :visible.sync="visible"
      :xgModelPoint="xgModelPoint"
      :hosts="hostList"
      :endpoints="endpointList"
      :metrics="metricList"
      :answers="answerList"
      :thresholds="thresholdList"
      v-if="visible"
    />
  </div>

</template>
<script>
import { PatrolService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import { dealQuery, downloadFile } from '@/utils/util'
import HostSchema from './modules/HostSchema.vue'
import ZoneSelect from './modules/ZoneSelect'
import { mapState } from 'vuex'
import _ from 'lodash'
import { sql } from '@/utils/request'

export default {
  name: 'PatrolConfig',
  mixins: [Confirm, List],
  props: {},
  components: {
    HostSchema,
    ZoneSelect
  },
  data () {
    this.fetchHost = _.debounce(this.fetchHost, 800)
    this.fetchEndpoint = _.debounce(this.fetchEndpoint, 800)
    this.fetchMetric = _.debounce(this.fetchMetric, 800)
    this.fetchAnswer = _.debounce(this.fetchAnswer, 800)
    this.fetchThreshold = _.debounce(this.fetchThreshold, 800)
    return {
      table: {
        pageNumber: 1,
        pageSize: 10
      },
      a_check: {
        value: false
      },
      columns: [
        {
          slots: { title: 'checkboxes' },
          scopedSlots: { customRender: 'checkbox' },
          customCell: (row, index) => {
            if (index !== this.checkpoints.indexOf(row.checkpoint_id)) {
              return {
                style: { display: 'none' },
                attrs: {
                  rowSpan: 0
                }
              }
            } else {
              let count = 0
              for (const argument of this.checkpoints) {
                if (argument === row.checkpoint_id) {
                  count += 1
                }
              }
              return {
                attrs: {
                  rowSpan: count
                }
              }
            }
          }
        },
        {
          title: '点位',
          dataIndex: 'checkpoint_alias',
          customCell: (row, index) => {
            if (this.checkpoints.length < 10) { this.checkpoints.push(row.checkpoint_id) }
            if (index !== this.checkpoints.indexOf(row.checkpoint_id)) {
              return {
                style: { display: 'none' },
                attrs: {
                  rowSpan: 0
                }
              }
            } else {
              let count = 0
              for (const argument of this.checkpoints) {
                if (argument === row.checkpoint_id) {
                  count += 1
                }
              }
              return {
                attrs: {
                  rowSpan: count
                }
              }
            }
          }
        },
        {
          title: '二维码',
          align: 'center',
          scopedSlots: { customRender: 'code' },
          customCell: (row, index) => {
            if (index !== this.checkpoints.indexOf(row.checkpoint_id)) {
              return {
                style: { display: 'none' },
                attrs: {
                  rowSpan: 0
                }
              }
            } else {
              let count = 0
              for (const argument of this.checkpoints) {
                if (argument === row.checkpoint_id) {
                  count += 1
                }
              }
              return {
                attrs: {
                  rowSpan: count
                }
              }
            }
          }
        },
        {
          title: '监控对象',
          dataIndex: 'host_alias',
          customCell: (row, index) => {
            if (this.hostTable.length < 10) {
              this.hostTable.push(row.host_id)
            }
            if (index !== this.hostTable.indexOf(row.host_id)) {
              return {
                style: { display: 'none' },
                attrs: {
                  rowSpan: 0
                }
              }
            } else {
              let count = 0
              for (const argument of this.hostTable) {
                if (argument === row.host_id) {
                  count += 1
                }
              }
              return {
                attrs: {
                  rowSpan: count
                }
              }
            }
          }
        },
        {
          title: '监控实体',
          dataIndex: 'endpoint_alias',
          scopedSlots: { customRender: 'endpoint' },
          customCell: (row, index) => {
            if (this.endpointTable.length < 10) {
              this.endpointTable.push(row.endpoint_id)
            }
            if (index !== this.endpointTable.indexOf(row.endpoint_id)) {
              return {
                style: { display: 'none' },
                attrs: {
                  rowSpan: 0
                }
              }
            } else {
              let count = 0
              for (const argument of this.endpointTable) {
                if (argument === row.endpoint_id) {
                  count += 1
                }
              }
              return {
                attrs: {
                  rowSpan: count
                }
              }
            }
          }
        },
        {
          title: '检查项',
          dataIndex: 'metric_alias'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          customCell: (row, index) => {
            if (index !== this.hostTable.indexOf(row.host_id)) {
              return {
                style: { display: 'none' },
                attrs: {
                  rowSpan: 0
                }
              }
            } else {
              let count = 0
              for (const argument of this.hostTable) {
                if (argument === row.host_id) {
                  count += 1
                }
              }
              return {
                attrs: {
                  rowSpan: count
                }
              }
            }
          }
        }
      ],
      hostTable: [],
      endpointTable: [],
      data: [],
      disableBtn: true,
      checkpoints: [],
      qcCodeGlobalLoading: false,
      qcCodeLoading: {},
      pathId: null,
      zoneId: null,
      hostList: null,
      endpointList: null,
      metricList: null,
      answerList: null,
      thresholdList: null,
      selectedRowKeys: [],
      spinning: false,
      searchInput: '',
      visible: false,
      form: {
        hostId: '',
        hostAlias: '',
        endpoints: [
          {
            endpointId: '',
            endpointAlias: '',
            isVirtual: false,
            metric: [
              {
                metricId: '',
                answerId: '',
                threshold: {
                  condition: '',
                  lowerThreshold: '',
                  upperThreshold: '',
                  severity: 4
                }
              }
            ]
          }
        ]
      },
      fetching: false,
      pagination: {
        pageNo: 1,
        pageSize: 5,
        total: 0
      },
      xgModelPoint: { id: '', alias: '', path: '', zone: '' }
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    }),
    offset () {
      const { pageNo, pageSize } = this.pagination
      return (pageNo - 1) * pageSize
    },
    hasSelectedOne () {
      return this.selectedRowKeys.length > 0 && this.selectedRowKeys.length !== new Set(this.checkpoints).size
    },
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    hasSelectedAll () {
      return this.selectedRowKeys.length === new Set(this.checkpoints).size
    }
  },
  methods: {
    onPaginationChange (pageNumber) {
      this.$table.pageNumber = pageNumber
    },

    isChecked (id) {
      return this.selectedRowKeys.includes(id)
    },
    onSelectGroupChange () {
      if (!this.hasSelectedAll) {
        this.selectedRowKeys = []
        this.selectedRowKeys.push(...new Set(this.checkpoints))
        this.a_check.checked = true
      } else {
        this.selectedRowKeys = []
      }
    },
    onSelectChange (e) {
      if (this.selectedRowKeys.includes(e)) {
        this.selectedRowKeys.pop(e)
      } else {
        this.selectedRowKeys.push(e)
      }
    },
    async getPatrolPath ({ path_id = '1267708678983651329', zone_id = '1267708678362894336' }) {
      this.spinning = true
      this.data = []
      this.checkpoints = []
      this.selectedRowKeys = []
      this.hostTable = []
      this.endpointTable = []
      let query_sql = 'select * from v_patrol_path where 1=1 '
      query_sql += 'and path_id = ' + path_id
      query_sql += 'and zone_id =' + zone_id
      this.data = dealQuery(await sql(query_sql))
      this.spinning = false
    },
    async fetchHost () {
      this.fetching = true
      const get = await PatrolService.hostFind()
      if (get != null) {
        this.hostList = { }
        for (let i = 1; i < get.length; i++) {
          this.hostList[get[i][0]] = {
            id: get[i][0],
            alias: get[i][1] !== 'NULL' ? get[i][1] : '',
            endpoints: get[i][2].replace('[', '').replace(']', '').replaceAll(' ', '').split(',')
          }
        }
      }
      this.fetching = false
    },
    async fetchEndpoint () {
      this.fetching = true
      const get = await PatrolService.endpointFind()
      if (get != null) {
        this.endpointList = { }
        for (let i = 1; i < get.length; i++) {
          this.endpointList[get[i][0]] = {
            id: get[i][0],
            alias: get[i][1] !== 'NULL' ? get[i][1] : '',
            metrics: get[i][2].replace('[', '').replace(']', '').replaceAll(' ', '').split(',')
          }
        }
      }
      this.fetching = false
    },
    async fetchMetric () {
      this.fetching = true
      const get = await PatrolService.metricFind()
      if (get != null) {
        this.metricList = { }
        for (let i = 1; i < get.length; i++) {
          this.metricList[get[i][0]] = {
            id: get[i][0],
            alias: get[i][1] !== 'NULL' ? get[i][1] : '',
            answer_id: get[i][2]
          }
        }
      }
      this.fetching = false
    },
    async fetchAnswer () {
      this.fetching = true
      const get = await PatrolService.answerFind()
      if (get != null) {
        this.answerList = {}
        for (let i = 1; i < get.length; i++) {
          this.answerList[get[i][0]] = {
            id: get[i][0],
            alias: get[i][1] !== 'NULL' ? get[i][1] : '',
            type: get[i][2],
            format: JSON.parse(get[i][3])
          }
        }
      }
      this.fetching = false
    },
    async fetchThreshold () {
      this.fetching = true
      const res = await PatrolService.thresholdFind()
      if (res != null) {
        this.thresholdList = []
        for (let i = 1; i < res.length; i++) {
          this.thresholdList.push({
            host_id: res[i][0],
            endpoint_id: res[i][1],
            metric_id: res[i][2],
            answer_id: res[i][3],
            condition: res[i][4],
            lower_threshold: res[i][5],
            upper_threshold: res[i][6],
            severity: res[i][7]
          })
        }
      }
      this.fetching = false
    },
    changeZone ({ pathId, zoneId }) {
      this.table.pageNumber = 1
      this.getPatrolPath({ path_id: pathId, zone_id: zoneId })
    },
    // 点击编辑
    infoEdit (checkId, checkAlias, id) {
      if (this.fetching) {
        return
      }
      this.visible = true
      this.xgModelPoint = { id: checkId, alias: checkAlias, path: this.pathId, zone: this.zoneId }
      this.form.hostId = id
    },

    downloadQrCode ({ checkpointId, checkpointAlias }) {
      this.$set(this.qcCodeLoading, checkpointId, true)
      return PatrolService
        .qrCode(checkpointId)
        .then(async (res) => {
          await this.$nextTick()
          downloadFile(`${checkpointAlias ?? 'new'}.png`, new Uint8Array(res))
        })
        .finally(() => {
          this.$set(this.qcCodeLoading, checkpointId, false)
        })
    },

    async batchDownloadQrCode () {
      try {
        this.qcCodeGlobalLoading = true
        for (const checkpoint in this.selectedRowKeys) {
          await this.downloadQrCode({ checkpointId: checkpoint, checkpointAlias: 'new' })
        }
      } finally {
        this.qcCodeGlobalLoading = false
      }
    },

    changePagination (pageNo, pageSize) {
      Object.assign(this.pagination, { pageNo, pageSize })
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
    }
  },
  created () {
    this.fetchHost()
    this.fetchEndpoint()
    this.fetchMetric()
    this.fetchAnswer()
    this.fetchThreshold()
    this.getPatrolPath({})
  }
}
</script>

<style lang="less">
  @import url('./index.less');
  @import url('./utils.less');
  @import url('./layout.less');
</style>
