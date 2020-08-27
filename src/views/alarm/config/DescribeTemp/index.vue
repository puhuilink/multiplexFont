<template>
  <div class="DescribeTemp">
    <a-tabs :activeKey="tabIndex" @change="onTabChange">
      <a-tab-pane key="personal" tab="自定义模板"></a-tab-pane>
      <a-tab-pane key="common" tab="全局模板"></a-tab-pane>
    </a-tabs>

    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">

          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="模板名称"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.name" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="触发次数"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.number="queryParams.name" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAdd" v-show="tabIndex === 'personal'">新建</a-button>
        <a-button @click="onEdit" :disabled="!hasSelectedOne" v-show="tabIndex === 'personal'">编辑</a-button>
        <a-button @click="onBatchDelete" :disabled="!hasSelected">删除</a-button>
      </template>
    </CTable>
  </div>
</template>

<script>
import { List } from '@/components/Mixins'

export default {
  name: 'DescribeTemp',
  mixins: [List],
  components: {},
  props: {},
  data: () => ({
    tabIndex: 'personal',
    columns: Object.freeze([
      {
        title: '模板名称',
        dataIndex: '1',
        width: 200,
        sorter: true
      },
      {
        title: '触发条件',
        dataIndex: '12',
        width: 200,
        sorter: true
      },
      {
        title: '数据域',
        dataIndex: '123',
        width: 200,
        sorter: true
      },
      {
        title: '监控对象',
        dataIndex: '1234',
        width: 200,
        sorter: true
      },
      {
        title: '监控实体',
        dataIndex: '12345',
        width: 200,
        sorter: true
      },
      {
        title: '检查项',
        dataIndex: '123456',
        width: 200,
        sorter: true
      },
      {
        title: '更新时间',
        dataIndex: '1234567',
        width: 200,
        sorter: true
      },
      {
        title: '启用状态',
        dataIndex: '12345678',
        width: 200,
        sorter: true
      }
    ])
  }),
  computed: {},
  methods: {
    loadData () {
      return {}
    },
    onAdd () {},
    onBatchDelete () {},
    onEdit () {},
    onTabChange (tabIndex) {
      this.tabIndex = tabIndex
      this.query()
    }
  }
}
</script>

<style lang="less">

</style>
