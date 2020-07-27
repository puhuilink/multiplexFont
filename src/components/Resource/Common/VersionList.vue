<template>
  <div class="VersionList">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="_id"
      :rowSelection="null"
      :scroll="scroll"
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
import List from '@/components/Mixins/Table/List'

export default {
  name: 'VersionList',
  mixins: [List],
  data: () => ({
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
