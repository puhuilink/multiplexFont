<template>
  <a-spin :spinning="loading" wrapperClassName="ListSelect">

    <!-- / header -->
    <div class="ListSelect--header">
      <transition name="transition-scale">
        <a-input
          ref="inputSearch"
          class="transition-scale ListSelect--header-input-search"
          v-model.trim="searchLabel"
          v-show="showSearch"
        />
      </transition>

      <span class="ListSelect--header-title">{{ title }}</span>

      <a-button
        :icon="showSearch ? 'close' : 'search'"
        size="small"
        shape="circle"
        @click="onToggleShowSearch"
      />
    </div>

    <!-- / body -->
    <div class="ListSelect--body">
      <div
        v-for="{ key, label } in filterDataSource"
        :key="key"
        class="ListSelect--body-item transition-flip"
        :class="{ 'ListSelect--body-item_checked': isChecked(key) }"
        @click="onToggleChecked(key)"
      >

        <a-checkbox
          v-if="multiple"
          :checked="isChecked(key)"
          @click.stop="onToggleChecked(key)"
        >{{ label }}</a-checkbox>
        <span v-else>{{ label }}</span>
      </div>

      <div
        v-show="!filterDataSource.length"
        class="ListSelect--body-item_empty transition-flip"
      >
        <a-empty />
      </div>
    </div>

    <!-- / footer -->
    <div
      v-show="filterDataSource.length"
      class="ListSelect--footer"
    >
      <a-checkbox
        v-if="multiple"
        :checked="checkedAll"
        :indeterminate="indeterminate"
        @click.stop="onToggleCheckAll"
      >全选</a-checkbox>
      <span>{{ `共${filterDataSource.length}项，选中${filterCheckedKeys.length}项` }}</span>
    </div>

  </a-spin>
</template>

<script>
import { List } from 'ant-design-vue'
import _ from 'lodash'

export default {
  name: 'ListSelect',
  mixins: [],
  components: {},
  props: {
    ..._.pick(List.props, ['loading']),
    dataSource: {
      type: Array,
      default: () => [],
      validator: dataSource => dataSource.every(el => el && el['key'] && el['label'])
    },
    multiple: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array],
      default: () => []
    }
  },
  data: () => ({
    checkedKeys: [],
    searchLabel: '',
    showSearch: false
  }),
  computed: {
    filterDataSource () {
      return this.dataSource.filter(({ label }) => label.includes(this.searchLabel))
    },
    filterDataSourceKeys () {
      return this.filterDataSource.map(({ key }) => key)
    },
    filterCheckedKeys () {
      return _.intersection(this.checkedKeys, this.filterDataSourceKeys)
    },
    // 半选中状态
    indeterminate () {
      return this.filterCheckedKeys.length !== 0 && !this.checkedAll
    },
    // 全选中状态
    checkedAll () {
      return this.filterCheckedKeys.length === this.filterDataSource.length
    }
  },
  methods: {
    isChecked (key) {
      return this.checkedKeys.includes(key)
    },
    onToggleChecked (key) {
      const index = this.checkedKeys.indexOf(key)
      if (index === -1) {
        this.checkedKeys = this.multiple ? [ ...this.checkedKeys, key ] : [key]
      } else {
        this.checkedKeys.splice(index, 1)
      }
    },
    onToggleCheckAll () {
      this.checkedKeys = this.checkedAll ? [] : [ ...this.filterDataSourceKeys ]
    },
    async onToggleShowSearch () {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        await this.$nextTick()
        this.$refs['inputSearch'].focus()
      } else {
        this.searchLabel = ''
      }
    }
  }
}
</script>

<style lang="less">
.ListSelect {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 240px;
  height: 260px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;

  .ant-spin-container {
    &:extend(.ListSelect);
    border: none;
  }

  &.ant-spin-nested-loading > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &--header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    height: 32px;
    border-bottom: 1px solid #e8e8e8;

    &-input-search {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: calc(100% - 40px);
    }

    &-title {
      flex: 1;
      font-weight: 600;
    }
  }

  &--body {
    flex: 1;

      &-item {
        &:extend(.ellipsis);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        border-bottom: 1px solid #e8e8e8;
        background-color: transparent;

        &_checked {
          // TODO: theme less variables
          background-color: #e6f7ff;
        }

        &_empty {
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding-bottom: 25px;
        }
      }
  }

  &--footer {
    padding: 12px 24px;
    border-top: 1px solid #e8e8e8;
  }
}
</style>
