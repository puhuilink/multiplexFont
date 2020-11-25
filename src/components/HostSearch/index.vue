<template>
  <a-modal
    centered
    :afterClose="reset"
    :footer="null"
    :title="title"
    wrapClassName="HostSearch"
    :width="920"
    v-model="visible"
  >
    <a-form-model layout="inline" :model="queryParams" @submit.prevent="fetch">
      <a-form-model-item label="设备名称">
        <a-input v-model="queryParams.host_alias" allowClear />
      </a-form-model-item>

      <a-form-model-item>
        <a-button :disabled="!queryParams.host_alias" type="primary" html-type="submit">
          查询
        </a-button>
      </a-form-model-item>
    </a-form-model>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="false"
      rowKey="host_id"
      :scroll="{ x: false, y: 500 }"
      useFixedHeader
    ></a-table>
  </a-modal>
</template>

<script>
import { CmdbHostModelBrandService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'HostSearch',
  mixins: [Schema],
  components: {},
  props: {},
  data () {
    return {
      columns: [
        {
          dataIndex: 'device_model_value_code',
          title: '监控类型',
          width: 200
        },
        {
          dataIndex: 'brand_name',
          title: '品牌名称',
          width: 200
        },
        {
          dataIndex: 'host_alias',
          title: '设备名称',
          width: 250
        }
      ],
      dataSource: [],
      hasError: false,
      loading: false,
      queryParams: {
        host_alias: ''
      }
    }
  },
  computed: {},
  methods: {
    async fetch () {
      const where = generateQuery(this.queryParams)
      if (_.isEmpty(where)) return

      try {
        this.loading = true
        this.dataSource = await CmdbHostModelBrandService.find({ where })
      } catch (e) {
        this.dataSource = []
        throw e
      } finally {
        this.loading = false
      }
    },
    select () {
      this.show('快速查询设备')
    }
  },
  created () {
    // this.select()
    // this.visible = true
  }
}
</script>

<style lang="less">
.HostSearch {
  .ant-modal-body {
    height: 650px;
    overflow: auto;
  }
}
</style>
