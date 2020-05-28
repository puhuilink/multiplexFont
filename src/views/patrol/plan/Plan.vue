<template>
  <div class="plan-management">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="plan_id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更区域"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-cascader
                    style="width: 100%"
                    placeholder="请选择"
                    :options="screening.ascriptionList"
                    v-model="queryParams.ascription"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="计划名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.plan_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="执行小组"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.group_code"
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
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.plan_type"
                    placeholder="请选择"
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
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.is_enable"
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
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.route_code" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="计划编号"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.plan_code" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="add">新增</a-button>
        <a-button :disabled="hasSelectedOne" @click="edit">编辑</a-button>
        <a-button :disabled="hasSelected" @click="batchDelete">删除</a-button>
      </template>

    </CTable>

    <detail
      ref="detail"
      @addSuccess="query"
    ></detail>
  </div>
</template>

<script>
import detail from '../modules/PMDetail'
import { getPlanList, deletePlan, getUserGroupList } from '@/api/controller/patrol'
import screening from '../screening'
import { Confirm, List } from '@/components/Mixins'

export default {
  name: 'Plan',
  mixins: [Confirm, List],
  components: {
    detail
  },
  data () {
    return {
      screening,
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
          sorter: true
        },
        {
          title: '相关路线编码',
          dataIndex: 'route_code',
          sorter: true
        }
      ],
      loadData: parameter => {
        this.selectedRowKeys = []
        const variables = {
          ...parameter,
          where: {
            ...this.queryParams.ascription ? {
              ascription: {
                _eq: this.queryParams.ascription[this.queryParams.ascription.length - 1]
              }
            } : {},
            ...this.queryParams.plan_name ? {
              plan_name: {
                _ilike: `%${this.queryParams.plan_name.trim()}%`
              }
            } : {},
            ...this.queryParams.group_code ? {
              group_code: {
                _eq: this.queryParams.group_code
              }
            } : {},
            ...this.queryParams.plan_type ? {
              plan_type: {
                _eq: this.queryParams.plan_type
              }
            } : {},
            ...this.queryParams.is_enable ? {
              is_enable: {
                _eq: this.queryParams.is_enable
              }
            } : {},
            ...this.queryParams.route_code ? {
              route_code: {
                _ilike: `%${this.queryParams.route_code.trim()}%`
              }
            } : {},
            ...this.queryParams.plan_code ? {
              plan_code: {
                _ilike: `%${this.queryParams.plan_code.trim()}%`
              }
            } : {}
          }
        }
        return getPlanList(variables).then(r => r.data)
      },
      userGroupList: []
    }
  },
  methods: {
    async getGroupList () {
      await getUserGroupList().then(r => {
        this.userGroupList = r.data.data
      })
    },
    add () {
      this.$refs['detail'].open('', 'New')
    },
    edit () {
      this.$refs['detail'].open(this.selectedRows[0], 'Edit')
    },
    async batchDelete () {
      this.$confirmDelete({
        onOk: () => deletePlan({ IDs: this.selectedRowKeys })
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    }
  },
  created () {
    this.getGroupList()
  }
}
</script>

<style scoped lang='less'>
</style>
