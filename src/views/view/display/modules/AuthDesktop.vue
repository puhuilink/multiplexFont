<template>
  <a-modal
    centered
    :confirmLoading="loading"
    destroyOnClose
    :title="title"
    :width="720"
    wrapClassName="AuthDesktop__modal"
    :visible="visible"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="视图管理" key="1">
        <a-transfer
          :dataSource="dataSource"
          showSearch
          :filterOption="filterOption"
          :targetKeys="_targetKeys"
          @change="handleChange"
          @search="handleSearch"
          :render="item => item.view_title"
        >
        </a-transfer>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { getViewListInGroupAuth } from '@/api/controller/ViewGroup'
import { getViewList } from '@/api/controller/View'
import _ from 'lodash'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

export default {
  name: 'AuthDesktop',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    groupId: {
      type: String,
      default: ''
    },
    selectedKeys: {
      type: Array,
      default: () => ([])
    }
  },
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    record: null,
    dataSource: [],
    targetKeys: []
  }),
  computed: {
    dataSourceKeys () {
      return this.dataSource.map(el => el.key)
    },
    _targetKeys: {
      get () {
        // 求交集，去除历史冗余数据
        return _.intersection(
          this.targetKeys,
          this.dataSourceKeys
        )
      },
      set (v) {
        this.targetKeys = v
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler () {
        const { visible, groupId } = this
        if (visible && groupId) {
          this.fetchGroupViewList(groupId)
        }
      }
    }
  },
  methods: {
    cancel () {
      // this.visible = false
      this.$emit('update:visible', false)
    },
    /**
     * 用户组当前授予的视图
     */
    async fetchGroupViewList (groupId) {
      try {
        const groupViewList = await getViewListInGroupAuth(groupId).then(r => r.data.data)
        // console.log(groupViewList)
        const viewIdList = groupViewList.map(el => Number(el.view_id))
        this.dataSource = await getViewList({
          limit: 9999,
          where: {
            view_id: {
              _in: viewIdList
            }
          }
        }).then(r => r.data.data).then(r => r.map(el => {
          // console.log(el.view_id, el.view_title)
          return ({
            ...el,
            title: el['view_title'],
            key: el['view_id'].toString(),
            description: '',
            chosen: false
          })
        }))
        this.targetKeys = this.selectedKeys.map(key => `${key}`)
      } catch (e) {
        this.datSource = []
        throw e
      }
    },
    filterOption (inputValue, option) {
      const title = option['view_title'] || ''
      return title.includes(
        inputValue.trim().toLowerCase()
      )
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
.AuthDesktop__modal {
  .ant-modal-body {
    padding-top: 0;
    height: 508px;
  }
  .ant-transfer {
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .ant-transfer-operation {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ant-transfer-list {
    height: 400px;
    flex: 1;
  }
}
</style>
