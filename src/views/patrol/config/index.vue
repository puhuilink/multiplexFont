<template>
  <div class="PatrolConfig">
    <div class="PatrolConfig__header">
      <ZoneSelect @change="changeZone" :path-id="pathId">
        <div class="PatrolConfig__operation" style="width: 100%;">
          <a-form class="d-flex flex-row" style="width: 100%;">
            <div class="fold">
              <a-row :gutter="[8, 8]">
                <a-col class="search_box">
                  <label class="search_label">搜索条件
                    <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
                  </label>
                  <a-button
                    type="primary"
                    @click="() => {
                      this.getPatrolPath(1, {checkpoint_alias:this.alias})
                    }"
                  >查询</a-button>
                  <a-button
                    style="margin-left: 8px;"
                    type="primary"
                    @click="backToPath"
                  >返回
                  </a-button>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="点位名称" v-bind="formItemLayout">
                    <a-input
                      allowClear
                      class="PatrolConfig__search"
                      placeholder="搜索点位名称"
                      :style="{
                        'margin-right': '12px'
                      }"
                      v-model.trim="alias"
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </ZoneSelect>
    </div>
    <div class="operation_box">
      <a-button
        :disabled="!hasSelected"
        :loading="qcCodeGlobalLoading"
        :type="hasSelected?'primary':''"
        @click="batchDownloadQrCode"
      ><a-icon type="download" />下载</a-button>
      <a-divider type="vertical"/>
      <a-button @click="editPatrolConfig('newZone',{})">
        <a-icon type="plus" style="color: gray"/>
        新建楼层
      </a-button>
    </div>
    <a-table
      ref="table"
      :columns="columns"
      :scroll="{ x: 1500 }"
      :data-source="data"
      :row-key="(record,index) => index"
      bordered
      :loadind="spinning"
      :pagination="{
        current: table.pageNumber,
        defaultPageSize: 10,
        total:this.pagination.total,
        showTotal: (total,range)=> `${range[0]}-${range[1]}共${total}个检查项`,
        onChange:(pageNumber) =>{
          table.pageNumber = pageNumber
          getPatrolPath(pageNumber,{checkpoint_alias:this.alias})
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
      <template slot="code" slot-scope="value,row">
        <a
          @click="downloadQrCode({ checkpointId: row.checkpoint_id, checkpointAlias: row.checkpoint_alias })"
        >
          下载
        </a>
      </template>
      <template slot="action" slot-scope="value,row">
        <a-dropdown>
          <a
            type="primary"
            v-action:F010001001003001
          ><a-icon type="form" />
            路线变更
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-sub-menu key="edit" title="编辑">
              <a-menu-item key="editZone" @click="editPatrolConfig('editZone',row)">修改楼层名称</a-menu-item>
              <a-menu-item key="editPoint" @click="editPatrolConfig('editPoint',row)">修改点位名称</a-menu-item>
              <a-menu-item key="editHost" @click="editPatrolConfig('editHost',row)">修改设备信息</a-menu-item>
              <a-menu-item key="editEndpoint" @click="editPatrolConfig('editEndpoint',row)">修改检查实体信息</a-menu-item>
              <a-menu-item key="editMetric" @click="editPatrolConfig('editMetric',row)">修改检查项信息</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="add" title="新增">
              <a-menu-item key="newMetric" @click="editPatrolConfig('newMetric',row)">仅新增检查项</a-menu-item>
              <a-menu-item key="newEndpoint" @click="editPatrolConfig('newEndpoint',row)">新增监控实体及以下</a-menu-item>
              <a-menu-item key="newHost" @click="editPatrolConfig('newHost',row)">新增设备及以下</a-menu-item>
              <a-menu-item key="newPoint" @click="editPatrolConfig('newPoint',row)">新增点位及以下</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-dropdown>
        <a-divider type="vertical"/>
        <a
          type="primary"
          @click="()=>toRemove(row)"
          v-action:F010001001003001
        ><a-icon type="delete" />
          删除
        </a>
      </template>

    </a-table>
    <HostSchema
      ref="configSchema"
      @refresh="() => {
        this.getPatrolPath(1, {checkpoint_alias:this.alias})
      }"
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
import { sql, xungeng } from '@/utils/request'

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
      alias: '',
      formStatus: 1,
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
          align: 'center',
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
          // slots: { title: 'checkpoint' },
          title: '点位',
          dataIndex: 'checkpoint_alias',
          align: 'center',
          scopedSlots: { customRender: 'checkpoint' },
          customCell: (row, index) => {
            if (this.checkpoints.length < this.data.length) { this.checkpoints.push(row.checkpoint_id) }
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
          width: '10%',
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
          align: 'center',
          scopedSlots: { customRender: 'host' },
          customCell: (row, index) => {
            if (this.hostTable.length < this.data.length) {
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
          align: 'center',
          width: '15%',
          dataIndex: 'endpoint_alias',
          scopedSlots: { customRender: 'endpoint' },
          customCell: (row, index) => {
            if (this.endpointTable.length < this.data.length) {
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
          fixed: 'right',
          width: '300px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      hostTable: [],
      endpointTable: [],
      data: [],
      disableBtn: true,
      checkpoints: [],
      qcCodeGlobalLoading: false,
      qcCodeLoading: {},
      pathId: '1267708678983651329',
      zoneId: '1267708678362894336',
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
      xgModelPoint: { id: '', alias: '', path: '', zone: '' },
      delId: null,
      deleteVisible: false
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
    editPatrolConfig (type, data) {
      this.$refs.configSchema.infoConfig(type, data, this.pathId, this.zoneId)
    },
    toRemove (item) {
      const that = this
      this.$confirm({
        title: '确定要删除该项吗',
        content: '删除后路径相关信息将变更',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.deleteMetric(item)
        },
        onCancel () {}
      })
    },
    async deleteMetric (row) {
      const result = await xungeng.post('/path/deletePath', {
        pathId: this.pathId,
        zoneId: this.zoneId,
        checkpointId: row.checkpoint_id,
        hostId: row.host_id,
        endpointId: row.endpoint_id,
        metricId: row.metric_id,
        answerId: row.answer_id
      })
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '巡更路径变更成功'
        })
        await this.getPatrolPath(1, {})
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
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
    async getPatrolPath (pageNo = 1, { checkpoint_alias }) {
      this.spinning = true
      this.data = []
      this.checkpoints = []
      this.selectedRowKeys = []
      this.hostTable = []
      this.endpointTable = []
      let query_sql = 'select * from v_patrol_path where 1=1 '
      let querys = 'select count(1) as total from v_patrol_path where 1=1 '
      query_sql += 'and path_id = ' + this.pathId
      query_sql += 'and zone_id =' + this.zoneId
      if (checkpoint_alias !== null && checkpoint_alias !== undefined && checkpoint_alias !== '') {
        query_sql += ' and checkpoint_alias like \'%' + checkpoint_alias + '%\''
        querys += ' and checkpoint_alias like \'%' + checkpoint_alias + '%\''
      }
      query_sql += ' limit 10 offset ' + (pageNo - 1) * 10
      this.data = dealQuery(await sql(query_sql))
      querys += ' and path_id = ' + this.pathId
      querys += ' and zone_id =' + this.zoneId
      this.pagination.total = parseInt(dealQuery((await sql(querys)))[0]['total'])
      this.spinning = false
    },
    changeZone ({ pathId, zoneId }) {
      this.table.pageNumber = 1
      this.pathId = pathId
      this.zoneId = zoneId
      this.getPatrolPath(1, {})
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
        for (const checkpoint of this.data) {
          await this.downloadQrCode({
            checkpointId: checkpoint,
            checkpointAlias: `${_.get(checkpoint, 'zone_alias', '当前楼层')}-${_.get(checkpoint, 'checkpoint_alias', '当前点位')}-${_.get(checkpoint, 'host_alias', '当前对象')}`
          })
        }
      } finally {
        this.qcCodeGlobalLoading = false
      }
    },
    backToPath () {
      this.$router.push('/patrol/config/path')
    },
    resetSelect () {
      Object.assign(this, {
        selectedRowKeys: [],
        selectedRows: []
      })
    },
    dealRouter () {
      const query = this.$route.query
      this.pathId = query.pathId
      this.zoneId = query.zoneId
    }
  },
  created () {
    this.dealRouter()
    this.getPatrolPath(1, {})
  }
}
</script>

<style lang="less">
@import url('./index.less');
@import url('./utils.less');
@import url('./layout.less');
</style>
