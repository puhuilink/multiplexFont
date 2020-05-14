<template>
  <div class="VersionList">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="_id"
      :rowSelection="null"
      :scroll="{ x: scrollX, y: `calc(100vh - 290px)`}"
    >
      <template #query>
        <a-form layout="inline">
          <div class="fold">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="版本"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.number="queryParams.version" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.label" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span class="fold_btn">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>
          </span>
        </a-form>
      </template>
    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'

export default {
  name: 'VersionList',
  components: {
    CTable
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 查询参数
    queryParams: {},
    formItemProps: {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14,
        offset: 2
      }
    }
  }),
  computed: {
    scrollX () {
      return this.columns
        .map(e => e.width || 60)
        .reduce((a, b) => a + b)
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      handler () {
        // 重置查询条件
        this.reset()
        // 重新查询
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    query () {
      this.$refs['table'].refresh(true)
    },
    resetQueryParams () {
      Object.assign(this.$data.queryParams, this.$options.data.apply(this).queryParams)
    },
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
.VersionList {
  .fold {
    display: inline-block;
    width: calc(100% - 216px);
  }

  .fold_btn {
    display: inline-block;
    transform: translateY(-15px);
  }
}
</style>
