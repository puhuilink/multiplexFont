/*
 * 计划管理 新增/编辑
 */
<template>
  <a-modal
    :title="mode=='New'?'计划新增':mode=='See'?'计划详情':'计划编辑'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="1200"
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
              v-decorator="['plan_name',{ initialValue: record.plan_name, rules: [{ required: true, message: '名称不能为空!' }] }]"
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
                v-for="item in enableList"
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
              v-decorator="['cycle_value',{ initialValue: record.cycle_value||'1' }]"
            />

            <a-radio-group
              v-if="cycleType==='W'"
              :disabled="mode=='See'"
              v-decorator="['cycle_value', { initialValue: record.cycle_value }]"
            >
              <a-radio
                v-for="item in cycleValueList"
                :key="item.code"
                :value="item.code"
              >
                {{ item.name }}
              </a-radio>
            </a-radio-group>
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
                v-decorator="['start_time', {
                  initialValue: moment(record.start_time,'YYYY-MM-DD'),
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
                v-decorator="['end_time', {
                  initialValue: moment(record.end_time,'YYYY-MM-DD'),
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
      </a-row>
    </a-form>
    <a-divider>路线选择</a-divider>
    <CTable
      ref="table"
      rowKey="route_id"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:`calc(100vh - 300px)` }"
      :rowSelection="mode!=='See'?{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }:false"
    >
      <template #query v-if="mode!=='See'">
        <a-form layout="inline">
          <a-row>
            <a-col :md="8" :sm="12">
              <a-form-item
                label="巡更区域"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 14, offset: 2 }"
                style="width: 100%">
                <a-select
                  allowClear
                  v-model="queryParam.ascription"
                  placeholder="请选择"
                  default-value=""
                >
                  <a-select-option value="MachineRoom-BJ">北京机房</a-select-option>
                  <a-select-option value="MachineRoom-XM">厦门机房</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12">
              <a-form-item
                label="路线名称"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 14, offset: 2 }"
                style="width: 100%">
                <a-input v-model="queryParam.route_name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12">
              <a-form-item
                label="路线编号"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 14, offset:2 }"
                style="width: 100%">
                <a-input v-model="queryParam.route_code" placeholder=""/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row style="padding-bottom: 10px">
            <a-col :md="24" :sm="24">
              <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {}">
                <a-button type="primary" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </template>

      <span slot="action" slot-scope="text, re">
        <a @click="seeRouteDetail(re)">查看详情</a>
      </span>
    </CTable>
    <a-divider>任务排班</a-divider>
    <!-- <a-transfer
      :dataSource="userList"
      :showSearch="false"
      :disabled="mode==='See'"
      :targetKeys="targetKeys"
      @change="handleChange"
      @search="handleSearch"
      :render="item => item.user.staff_name"
    >
    </a-transfer> -->
    <template slot="footer" >
      <a-button v-if="mode!=='See'" @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

    <routeDetail ref="routeDetail"></routeDetail>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getRouteList } from '@/api/controller/patrol'
import CTable from '@/components/Table/CTable'
import routeDetail from '../modules/RMDetail'
import gql from 'graphql-tag'
// eslint-disable-next-line no-unused-vars
import apollo from '@/utils/apollo'

// eslint-disable-next-line no-unused-vars
const currentUserList = gql`query ($groupId: String) {
  data: t_user_group (where: {group_id: { _eq: $groupId }}) {
    key: user_id
    title: user_id
    user {
      staff_name
    }
  }
}`

export default {
  name: 'PMDetail',
  components: {
    CTable,
    routeDetail
  },
  data () {
    return {
      advanced: false,
      // 查询参数
      queryParam: {},
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
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
      enableList: [
        {
          code: 0,
          name: '否'
        },
        {
          code: 1,
          name: '是'
        }
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
                _eq: this.queryParam.ascription
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
      record: '',
      mode: '',
      cycleType: '',
      // 所有数据
      userList: [],
      // 选中数据
      targetKeys: []
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
      console.log(record, mode)
      this.mode = mode
      if (record) {
        this.selectedRowKeys = record.route_code
        this.targetKeys = record.group_member.split(',')
        this.queryParam.route_code = record.route_code
      }
      this.record = record
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
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
        }
      })
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
    },
    cycleTypeChange (e) {
      this.cycleType = e.target.value
    },
    /**
     * 选中行更改事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    seeRouteDetail (route_code) {
      this.$refs['routeDetail'].open(route_code, 'See')
    },
    handleChange (targetKeys, direction, moveKeys) {
      // console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    }
  }
}
</script>

<style lang="less" scoped>
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
