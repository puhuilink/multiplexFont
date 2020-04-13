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
          :targetKeys="targetKeys"
          @change="handleChange"
          @search="handleSearch"
          :render="item => item.view_title"
          :rowKey="item => item.view_id"
        >
        </a-transfer>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { getViewListInGroupAuth } from '@/api/controller/ViewGroup'

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
  computed: {},
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
        this.datSource = groupViewList.map(el => Number(el.view_id))
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
