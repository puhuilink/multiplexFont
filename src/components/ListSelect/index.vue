<template>
  <div class="ListSelect">
    <a-list v-bind="$props" bordered :dataSource="filterDataSource">

      <!-- / header -->
      <template v-slot:header>
        <div class="ListSelect--header">

          <transition name="transition-scale">
            <a-input
              ref="inputSearch"
              class="transition-scale ListSelect--header-input-search"
              v-model.trim="searchTitle"
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
      </template>

      <!-- / body -->
      <template v-slot:renderItem="{ key, title }">
        <a-list-item
          class="ListSelect--item"
          :class="{ 'ListSelect--item_checked': isChecked(key) }"
          @click="onToggleChecked(key)"
        >

          <a-checkbox
            v-if="multiple"
            :checked="isChecked(key)"
            @click.stop="onToggleChecked(key)"
          >{{ title }}</a-checkbox>
          <span v-else>{{ title }}</span>

        </a-list-item>
      </template>

      <!-- / footer -->
      <template v-slot:footer v-if="multiple && filterDataSource.length">
        <a-checkbox
          :checked="checkedAll"
          :indeterminate="indeterminate"
          @click.stop="onToggleCheckAll"
        >全选</a-checkbox>
        <span>{{ `选中${checkedKeys.length}项` }}</span>
      </template>

    </a-list>
  </div>
</template>

<script>
import { List } from 'ant-design-vue'
import _ from 'lodash'

export default {
  name: 'ListSelect',
  mixins: [],
  components: {},
  props: {
    ..._.omit(List.props, ['bordered', 'header', 'footer', 'renderItem']),
    dataSource: {
      type: Array,
      default: () => [],
      validator: dataSource => dataSource.every(el => el && el['key'] && el['title'])
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
    searchTitle: '',
    showSearch: false
  }),
  computed: {
    filterDataSource () {
      return this.dataSource.filter(({ title }) => title.includes(this.searchTitle))
    },
    // 半选中状态
    indeterminate () {
      return this.checkedKeys.length !== 0 && !this.checkedAll
    },
    // 全选中状态
    checkedAll () {
      return this.checkedKeys.length === this.filterDataSource.length
    }
  },
  methods: {
    isChecked (key) {
      return this.checkedKeys.includes(key)
    },
    onToggleChecked (key) {
      const index = this.checkedKeys.indexOf(key)
      if (index === -1) {
        this.checkedKeys = this.multiple
          ? [ ...this.checkedKeys, key ]
          : [key]
      } else {
        this.checkedKeys.splice(index, 1)
      }
    },
    onToggleCheckAll () {
      this.checkedKeys = this.checkedAll
        ? []
        : [ ...this.filterDataSource.map(({ key }) => key) ]
    },
    async onToggleShowSearch () {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        await this.$nextTick()
        this.$refs['inputSearch'].focus()
      } else {
        this.searchTitle = ''
      }
    }
  }
}
</script>

<style lang="less">
.ListSelect {
  display: inline-block;
  width: 240px;

  .ant-list-header {
    padding: 0;
  }

  &--header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    height: 32px;

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

  &--item {
    background-color: transparent;
    transition: background-color .3s;

    &_checked {
      // TODO: theme less variables
      background-color: #e6f7ff;
      transition: background-color .3s;
    }
  }
}
</style>
