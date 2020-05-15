<template>
  <div class="plan-management">

    <CTable
      ref="table"
      rowKey="plan_id"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:`calc(100vh - 300px)` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更区域"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset:2 }"
                  style="width: 100%">
                  <a-cascader
                    style="width: 100%"
                    placeholder="请选择"
                    :options="screening.ascriptionList"
                    v-model="queryParam.ascription"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="计划名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset:2 }"
                  style="width: 100%">
                  <a-input v-model="queryParam.plan_name" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="执行小组"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.group_code"
                      placeholder="请选择"
                      default-value=""
                    >
                      <a-select-option
                        v-for="item in userGroupList"
                        :key="item.group_id"
                      >{{ item.group_name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="计划类型"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.plan_type"
                      placeholder="请选择"
                      default-value=""
                    >
                      <a-select-option
                        v-for="item in screening.planTypeList"
                        :key="item.code"
                      >{{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="是否启用"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.is_enable"
                      placeholder="请选择"
                      default-value=""
                    >
                      <a-select-option
                        v-for="item in screening.enableList"
                        :key="item.code"
                      >{{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="路线编号"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-input v-model="queryParam.route_code" placeholder=""/>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="计划编号"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-input v-model="queryParam.plan_code" placeholder=""/>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </div>
          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParam = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="edit"
        >
          编辑
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
        >
          删除
        </a-button>
      </template>

      <span slot="planCode" slot-scope="text">
        <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
      </span>
    </CTable>

    <detail
      ref="detail"
      @addSuccess="$refs['table'].refresh(false)"
    ></detail>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
import detail from '../modules/PMDetail'
import { getPlanList, deletePlan, getUserGroupList } from '@/api/controller/patrol'
import screening from '../screening'

export default {
  name: 'Plan',
  components: {
    CTable,
    Ellipsis,
    detail
  },
  data () {
    return {
      screening,
      advanced: false,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '巡更区域',
          dataIndex: 'ascription',
          width: 150,
          sorter: true,
          customRender: (text) => {
            this.screening.ascriptionList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        {
          title: '计划名称',
          dataIndex: 'plan_name',
          width: 150,
          sorter: true
        },
        {
          title: '执行小组',
          dataIndex: 'group_code',
          width: 150,
          sorter: true,
          customRender: (text) => {
            this.userGroupList.forEach(element => {
              if (element.group_id === text) {
                text = element.group_name
              }
            })
            return text
          }
        },
        {
          title: '计划类型',
          dataIndex: 'plan_type',
          width: 120,
          sorter: true,
          customRender: (text) => {
            this.screening.planTypeList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        {
          title: '是否启用',
          dataIndex: 'is_enable',
          width: 150,
          sorter: true,
          customRender: (text) => {
            this.screening.enableList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        {
          title: '计划编码',
          dataIndex: 'plan_code',
          width: 150,
          sorter: true,
          scopedSlots: { customRender: 'planCode' }
        },
        {
          title: '相关路线编码',
          dataIndex: 'route_code',
          sorter: true
        }
        // {
        //   title: '路线展示',
        //   dataIndex: 'way',
        //   scopedSlots: { customRender: 'way' }
        // }
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
            ...this.queryParam.plan_name ? {
              plan_name: {
                _ilike: `%${this.queryParam.plan_name.trim()}%`
              }
            } : {},
            ...this.queryParam.group_code ? {
              group_code: {
                _eq: this.queryParam.group_code
              }
            } : {},
            ...this.queryParam.plan_type ? {
              plan_type: {
                _eq: this.queryParam.plan_type
              }
            } : {},
            ...this.queryParam.is_enable ? {
              is_enable: {
                _eq: this.queryParam.is_enable
              }
            } : {},
            ...this.queryParam.route_code ? {
              route_code: {
                _ilike: `%${this.queryParam.route_code.trim()}%`
              }
            } : {},
            ...this.queryParam.plan_code ? {
              plan_code: {
                _ilike: `%${this.queryParam.plan_code.trim()}%`
              }
            } : {}
          }
        }
        return getPlanList(variables).then(r => r.data)
      },
      userGroupList: [],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  created () {
    this.getGroupList()
  },
  filters: {},
  computed: {
    scrollX: {
      get () {
        return this.columns.map(e => e.width || 0).reduce((x1, x2) => (x1 + x2))
      }
    }
  },
  methods: {
    async getGroupList () {
      await getUserGroupList().then(r => {
        this.userGroupList = r.data.data
      })
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
    add () {
      this.$refs['detail'].open('', 'New')
    },
    edit () {
      // const [record] = this.selectedRows
      // this.$refs['detail'].edtt(record)
      this.$refs['detail'].open(this.selectedRows[0], 'Edit')
    },
    /**
     * 查询
     * @param {Boolean} firstPage 是否从第一页开始
     */
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    async deleteCtrl () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        const variables = {
          IDs: this.selectedRowKeys
        }
        await deletePlan(variables)
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
        // FIXME: 是否存在分页问题
        this.$refs['table'].refresh(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
