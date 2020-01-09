<template>
  <GraphTable
    rowKey="_id_s"
    :columns="columns"
    :dataSource="dataSource"
    :loading="$apollo.queries.dataSource.loading"
  >
    <!-- / 查询 -->
    <template #query>
      <a-form layout="inline">
        <a-row>
          <div>
            <a-col :md="12" :sm="24">
              <a-form-item label="name">
                <a-input allowClear v-model="queryParams.name_s" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="display name">
                <a-input allowClear v-model="queryParams.label_s" />
              </a-form-item>
            </a-col>
          </div>
        </a-row>
      </a-form>
    </template>

    <!-- / 操作 -->
    <template #opration>
      <a-button>新建</a-button>
      <a-button>编辑</a-button>
      <a-button>删除</a-button>
      <a-button>数据检查</a-button>
      <a-button>筛选</a-button>
    </template>
  </GraphTable>
</template>

<script>
import gql from 'graphql-tag'
import GraphTable from '@/components/GraphTable'

export default {
  name: 'InstanceTable',
  apollo: {
    dataSource: {
      query: gql`query MyQuery($parentname_s: String!) {
        ngecc_instance(where: {parentname_s: {_eq: $parentname_s}}) {
          _class_s
          _id_s
          createtime_t
          creator_s
          label_s
          name_s
          parentname_s
          parenttree_s
          permissionallowextend_b
          updatetime_t
          updator_s
          values_e
          version_i
        }
      }`,
      loadingKey: 'loading',
      update: data => data.ngecc_instance,
      skip: vm => !vm.parentnameS,
      variables () {
        return {
          parentname_s: this.parentnameS
        }
      }
    }
  },
  props: {
    parentnameS: {
      type: String,
      default: ''
    }
  },
  components: {
    GraphTable
  },
  data: () => ({
    dataSource: [],
    queryParams: {},
    loading: false
  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: 'ID',
            dataIndex: '_id_s'
          },
          {
            title: 'name',
            dataIndex: 'name_s'
          },
          {
            title: 'display name',
            dataIndex: 'label_s'
          },
          {
            title: 'parent',
            dataIndex: 'parentname_s'
          },
          {
            title: 'icon',
            dataIndex: 'icon_s'
          }
        ]
      }
    }
  }
}
</script>

<style lang="less">
</style>
