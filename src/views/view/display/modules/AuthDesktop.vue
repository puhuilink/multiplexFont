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
    okText="提交"
    cancelText="取消"
    @ok="submit"
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="桌面分配" key="1">
        <a-transfer
          :dataSource="dataSource"
          :filterOption="filterOption"
          :render="item => item.title"
          showSearch
          :targetKeys="_targetKeys"
          @change="handleChange"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { AuthorizeObjectService, ViewDesktopService } from '@/api'
import _ from 'lodash'

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
    userId: {
      type: String,
      default: ''
    },
    selectedKeys: {
      type: Array,
      default: () => ([])
    }
  },
  data: (vm) => ({
    loading: false,
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
        if (this.visible) {
          this.fetch({
            user_id: this.userId,
            group_id: this.groupId
          })
        }
      }
    }
  },
  methods: {
    /**
     * 关闭 | 取消模态框
     */
    cancel () {
      this.$emit('update:visible', false)
    },
    async fetch ({ user_id, group_id }) {
      try {
        const viewList = await AuthorizeObjectService.viewList({ user_id, group_id })
        this.dataSource = viewList.map((el) => ({
          title: el['view_title'],
          key: el['view_id'].toString(),
          description: '',
          chosen: false
        }))
        this.targetKeys = this.selectedKeys.map(key => `${key}`)
      } catch (e) {
        this.datSource = []
        this.targetKeys = []
        throw e
      }
    },
    filterOption (inputValue, option) {
      const title = option['title'] || ''
      return title.toLowerCase().includes(
        inputValue.trim().toLowerCase()
      )
    },
    handleChange (targetKeys) {
      this.targetKeys = targetKeys
    },
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async submit () {
      const { userId, groupId, _targetKeys } = this
      try {
        this.loading = true
        if (userId) {
          await ViewDesktopService.updateUserDesktop(userId, _targetKeys.map(Number))
        } else {
          await ViewDesktopService.updateGroupDesktop(groupId, _targetKeys.map(Number))
        }
        this.$notification.success({
          message: '系统提示',
          description: '桌面分配成功'
        })
        this.cancel()
        this.$emit('success')
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
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
