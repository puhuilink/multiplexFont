/*
 * 计划管理 新增/编辑
 */
<template>
  <a-modal
    :title="mode=='New'?'计划新增':mode=='See'?'计划详情':'计划编辑'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="1000"
    :visible="visible"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-form
      id="components-form-demo-validate-other"
      :form="form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            label="计划名称"
          >
            <a-input
              v-decorator="['plan_name',{ initialValue: record.plan_name, rules: [{ required: true, message: '计划名称不能为空!' }] }]"
              :disabled="mode=='See'"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="计划创始人">
            <a-input
              disabled
              v-decorator="['create_user', { initialValue: record.create_user||nickname, rules: [{ required: true, message: '创始人不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="启用">
            <a-select
              :disabled="mode=='See'"
              v-decorator="['is_enable', { initialValue: record.is_enable, rules: [{ required: true, message: '启用不能为空!' }] }]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in screening.enableList"
                :key="item.code"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="计划类型">
            <a-select
              :disabled="mode=='See'"
              v-decorator="['plan_type', { initialValue: record.plan_type||'A', rules: [{ required: true, message: '计划类型不能为空!' }] }]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in planTypeList"
                :key="item.code"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="循环周期">
            <a-radio-group
              :disabled="mode=='See'"
              v-decorator="['cycle_type', { initialValue: record.cycle_type||'D', rules: [{ required: true, message: '循环周期不能为空!' }] }]"
            >
              <a-radio
                v-for="item in cycleTypeList"
                :key="item.code"
                :value="item.code"
                @change="cycleTypeChange"
              >
                {{ item.name }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item :label="cycleType==='M'? '周期值(每月第几号)':'周期值(每周几)'" v-if="cycleType==='M'||cycleType==='W'">
            <a-input-number
              v-if="cycleType==='M'"
              :disabled="mode=='See'"
              :min="1"
              :max="31"
              v-decorator="['cycle_value_M',{ initialValue: record.cycle_value||'1' }]"
            />
            <a-checkbox-group
              v-if="cycleType==='W'"
              v-decorator="['cycle_value_W', { initialValue: record.cycleValueList }]"
            >
              <a-checkbox
                :disabled="mode=='See'"
                name="type"
                v-for="item in cycleValueList"
                :key="item.code"
                :value="item.code"
              >
                {{ item.name }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="* 有效期" style="margin-bottom:0;">
            <a-form-item
              :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
            >
              <a-date-picker
                style="width: 100%"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="生效日期"
                v-decorator="['start_time', {
                  initialValue: record.start_time?moment(record.start_time,'YYYY-MM-DD HH:mm:ss'):moment(new Date(),'YYYY-MM-DD HH:mm:ss'),
                  rules: [{ required: true, message: '生效日期不能为空!' }]
                }]"
              />
            </a-form-item>
            <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
              -
            </span>
            <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-date-picker
                style="width: 100%"
                show-time
                placeholder="失效日期"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="['end_time', {
                  initialValue:record.start_time?moment(record.end_time,'YYYY-MM-DD HH:mm:ss'):moment(new Date(),'YYYY-MM-DD HH:mm:ss'),
                  rules: [{ required: true, message: '失效日期不能为空!' }]
                }]"
              />
            </a-form-item>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            label="执行时间(07:30-08:30,15:30-18:00 ...)"
          >
            <a-input
              v-decorator="['work_time',{ initialValue: record.work_time, rules: [{ required: true, message: '执行时间不能为空!' }] }]"
              :disabled="mode=='See'"
            />
          </a-form-item>
        </a-col>
        <a-divider>任务排班</a-divider>
        <a-col :lg="12" :md="12" :sm="24" >
          <a-form-item label="工作组选择">
            <a-select
              allowClear
              v-decorator="['group_code', { initialValue: record.group_code, rules: [{ required: true, message: '工作组不能为空!' }]}]"
              placeholder="请选择"
              @change="taskGroupChange"
            >
              <a-select-option
                v-for="item in userGroupList"
                :key="item.group_id"
              >{{ item.group_name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24" >
          <a-form-item label="* 排班人员选择(请先选择工作组)">
            <a-checkbox-group
              v-if="userList"
              v-model="selectUser"
            >
              <a-checkbox
                :disabled="mode=='See'"
                name="type"
                v-for="item in userList"
                :key="item.code"
                :value="item.user.staff_name"
              >
                {{ item.user.staff_name }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <detail-list title="排班顺序" class="item-group">
      <!-- <detail-list-item v-for="user in selectUser" :key="user">{{ user }}</detail-list-item> -->
      <span v-for="user in selectUser" :key="user">{{ user }}</span>
    </detail-list>
    <a-divider>路线选择</a-divider>
    <template>
      <detail-list title="已选择路线">
        <detail-list-item term="路线名称">{{ selectRoute.route_name }}</detail-list-item>
        <detail-list-item term="路线编号">{{ selectRoute.route_code }}</detail-list-item>
      </detail-list>
    </template>
    <CTable
      v-if="mode!=='See'"
      ref="table"
      rowKey="route_id"
      type="radio"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:250 }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query v-if="routeSelect">
        <a-form layout="inline">
          <a-row>
            <a-col :md="12" :sm="12">
              <a-form-item
                label="巡更区域"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 14, offset: 2 }"
                style="width: 100%">
                <a-cascader
                  style="width: 100%"
                  placeholder="请选择"
                  :options="screening.ascriptionList"
                  v-model="queryParam.ascription"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item
                label="路线名称"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 14, offset: 2 }"
                style="width: 100%">
                <a-input v-model="queryParam.route_name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item
                label="路线编号"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 14, offset:2 }"
                style="width: 100%">
                <a-input v-model="queryParam.route_code" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <span :style=" { float: 'right', overflow: 'hidden' }">
                <a-button type="primary" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #operation >
        <a-button
          @click="routeSelectChange"
        >
          筛选路线
        </a-button>
      </template>
      <span slot="action" slot-scope="text, re">
        <a @click="seeRouteDetail(re)">查看详情</a>
      </span>
    </CTable>

    <template slot="footer" >
      <a-button v-if="mode!=='See'" @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

    <routeDetail ref="routeDetail"></routeDetail>
  </a-modal>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import CTable from '@/components/Table/CTable'
import routeDetail from '../modules/RMDetail'
import moment from 'moment'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import { mapGetters } from 'vuex'
import { getRouteList,
  getRouteDetail,
  insertPlan,
  mutatePlan,
  getUserGroupList
} from '@/api/controller/patrol'
import screening from '../screening'

const DetailListItem = DetailList.Item

const currentUserList = gql`query ($groupId: String) {
  data: t_user_group (where: {group_id: { _eq: $groupId }}) {
    code: user_id
    user {
      staff_name
    }
  }
}`
export default {
  name: 'PMDetail',
  components: {
    CTable,
    routeDetail,
    DetailList,
    DetailListItem
  },
  data () {
    return {
      screening,
      queryParam: {},
      record: '',
      mode: '',
      visible: false,
      loading: false,
      form: this.$form.createForm(this),
      planTypeList: [
        {
          code: 'A',
          name: '例行巡更'
        }
        // {
        //   code: 'B',
        //   name: '临时巡更'
        // }
      ],
      cycleTypeList: [
        {
          code: 'D',
          name: '每天'
        },
        {
          code: 'W',
          name: '每周'
        },
        {
          code: 'M',
          name: '每月'
        }
        // {
        //   code: 'T',
        //   name: '单次'
        // }
      ],
      cycleValueList: [
        {
          code: '1',
          name: '周一'
        },
        {
          code: '2',
          name: '周二'
        },
        {
          code: '3',
          name: '周三'
        },
        {
          code: '4',
          name: '周四'
        },
        {
          code: '5',
          name: '周五'
        },
        {
          code: '6',
          name: '周六'
        },
        {
          code: '7',
          name: '周日'
        }
      ],
      columns: [
        {
          title: '路线名称',
          dataIndex: 'route_name',
          width: 200,
          sorter: true
        },
        {
          title: '巡更区域',
          dataIndex: 'ascription',
          width: 200,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 'MachineRoom-XM':
                return '厦门机房'
              case 'MachineRoom-BJ':
                return '北京机房'
              case 'MachineRoom-XM-IT':
                return '厦门IT机房'
              case 'MachineRoom-XM-DH':
                return '厦门DH机房'
              default:
                return text
            }
          }
        },
        {
          title: '路线编号',
          dataIndex: 'route_code',
          width: 300,
          sorter: true
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        this.selectedRowKeys = []
        const variables = {
          ...parameter,
          where: {
            ...this.queryParam.ascription ? {
              ascription: {
                _eq: this.queryParam.ascription[this.queryParam.ascription.length - 1]
              }
            } : {},
            ...this.queryParam.route_name ? {
              route_name: {
                _ilike: `%${this.queryParam.route_name.trim()}%`
              }
            } : {},
            ...this.queryParam.route_code ? {
              route_code: {
                _ilike: `%${this.queryParam.route_code.trim()}%`
              }
            } : {}
          }
        }
        return getRouteList(variables).then(r => r.data)
      },
      selectedRowKeys: [],
      selectedRows: [],
      selectRoute: {},
      userGroupList: [],
      userList: [],
      selectUser: [],
      cycleType: '',
      routeSelect: false
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
    // this.form.setFieldsValue(record)
  },
  beforeMount () {
  },
  computed: {
    ...mapGetters(['nickname', 'avatar']),
    scrollX: {
      get () {
        return this.columns.map(e => e.width || 0).reduce((x1, x2) => (x1 + x2))
      }
    }
  },
  methods: {
    moment,
    async open (record, mode) {
      this.visible = true
      this.getGroupList()
      this.mode = mode
      if (record) {
        this.cycleType = record.cycle_type
        record.cycleValueList = record.cycle_value.split(',')
        record.taskPerson = record.group_member.split(',')
        this.selectUser = record.taskPerson
        this.queryParam.route_code = record.route_code
        this.queryRouteDetail(record.route_code)
        this.getCurrentUserListerList(record.group_code)
      }
      this.record = record
      console.log(record)
    },
    cycleTypeChange (e) {
      this.cycleType = e.target.value
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      if (selectedRowKeys.length > 1) {
        this.$notification.error({
          message: '系统提示',
          description: '只能选择一条路线，多选只取第一条，计划实际执行以已选择路线为准'
        })
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.selectRoute = selectedRows[0]
    },
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    queryRouteDetail (code) {
      const variables = {
        where: {
          route_code: {
            _eq: code
          }
        }
      }
      return getRouteDetail(variables).then(r => {
        this.selectRoute = r.data.data[0]
      })
    },
    async getGroupList () {
      await getUserGroupList().then(r => {
        this.userGroupList = r.data.data
      })
    },
    async getCurrentUserListerList (groupId) {
      try {
        const { data } = await apollo.clients.alert.query({
          query: currentUserList,
          variables: {
            groupId
          }
        })
        this.userList = data.data
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    seeRouteDetail (route_code) {
      this.$refs['routeDetail'].open(route_code, 'See')
    },
    taskGroupChange (e) {
      this.selectUser = []
      this.getCurrentUserListerList(e)
    },
    routeSelectChange () {
      this.routeSelect = !this.routeSelect
    },
    handleCancel (e) {
      this.visible = false
    },
    /**
     * 表单效验
     */
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (values.cycle_type === 'W') {
            values.cycle_value_W.sort((a, b) => { return a - b })
          }
          const planInfo = {
            plan_code: screening.createUniqueId(),
            plan_name: values.plan_name,
            plan_type: values.plan_type,
            ascription: this.selectRoute.ascription,
            group_code: values.group_code,
            group_member: this.selectUser.toString(),
            create_user: values.create_user,
            is_enable: values.is_enable,
            route_code: this.selectRoute.route_code,
            start_time: moment(values.start_time).format(),
            end_time: moment(values.end_time).format(),
            cycle_type: values.cycle_type,
            cycle_value: values.cycle_type === 'W' ? values.cycle_value_W.toString() : values.cycle_type === 'M' ? values.cycle_value_M : '',
            work_time: values.work_time
          }
          console.log(planInfo)
          if (this.mode === 'New') {
            planInfo.create_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            this.insert(planInfo)
          } else if (this.mode === 'Edit') {
            planInfo.update_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            this.mutate(planInfo)
          }
        }
      })
    },
    insert (values) {
      const variables = {
        objects: [{
          ...values
        }]
      }
      return insertPlan(variables).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '新增成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    },
    mutate (values) {
      const variables = {
        where: {
          'plan_id': {
            '_eq': this.record.plan_id
          }
        },
        val: {
          ...values
        }
      }
      return mutatePlan(variables).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .item-group {
    font-size: 0;
    span {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 100px;
    }
  }
</style>
