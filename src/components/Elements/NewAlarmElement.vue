<template>
  <div class="list-element">

    <!-- S 列表 -->
    <a-table
      class="alarmTable"
      :loading="loading"
      style="height: 100%"
      size="small"
      :customHeaderRow="() => ({ style: headerRowStyle ,cursor: 'default'})"
      :customRow="customRow"
      :columns="columns"
      :dataSource="dataSource"
      rowKey="uuid"
      ref="table"
      :scroll="scroll"
      :pagination="false"
      :locale="locale"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`搜索 ${column.title}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          搜索
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          重置
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
    <!-- E 列表 -->
  </div>
</template>

<script>

import NewAlarmMixin from '~~~/Elements/NewAlarmMixin'

export default {
  name: 'NewAlarmElement',
  mixins: [NewAlarmMixin]
}
</script>

<style lang="less">
.list-element {
  .ant-table-placeholder {
    display: none;
  }
}
</style>
