<template>
  <div class="CiPointInList">
    <CTable
      ref="pointInTable"
      rowKey="_id"
      :columns="columns"
      :scroll="{ y: 480 }"
      :data="loadData"
    >

      <template #query>
        <a-form layout="inline">
          <div class="fold">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="ID"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input allowClear v-model="queryParams._id" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="显示名称"
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input allowClear v-model="queryParams.label" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="$refs['pointInTable'].refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
          </span>
        </a-form>
      </template>

    </CTable>
  </div>
</template>

<script>
import { InstanceService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
import CTable from '@/components/Table/CTable'

// 指入关系
export default {
  name: 'CiPointInList',
  components: {
    CTable
  },
  props: {
    pointInInstanceList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    advanced: false,
    queryParams: {}
  }),
  computed: {
    columns () {
      return [
        {
          title: 'ID',
          dataIndex: '_id',
          sorter: true
        }, {
          title: '名称',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '显示名称',
          dataIndex: 'label',
          sorter: true
        }
      ]
    }
  },
  methods: {
    async loadData (parameter) {
      const { pointInInstanceList } = this
      return InstanceService.find({
        where: {
          // TODO: 当 this.pointInQueryParams 也包含 name 时会覆盖默认 name，改为 _and
          name: {
            _in: pointInInstanceList.map(({ source }) => source)
          },
          ...generateQuery(this.pointInQueryParams)
        },
        fields: [
          '_id',
          'name',
          'label'
        ],
        alias: 'data',
        ...parameter
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">

</style>
