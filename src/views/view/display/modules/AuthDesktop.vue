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
    @ok="submit"
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
import { getViewListInGroupAuth, getViewListInUserAuth } from '@/api/controller/ViewGroup'
import { editDesktopContent } from '@/api/controller/ViewDesktop'
import { getViewList } from '@/api/controller/View'
// eslint-disable-next-line
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
    userId: {
      type: String,
      default: ''
    },
    selectedKeys: {
      type: Array,
      default: () => ([])
    },
    desktopId: {
      type: [String, Number],
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
  computed: {
    dataSourceKeys () {
      return this.dataSource.map(el => el.key)
    },
    _targetKeys: {
      get () {
        // 求交集，去除历史冗余数据
        return this.targetKeys
        // return _.intersection(
        //   this.targetKeys,
        //   this.dataSourceKeys
        // )
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
        const { visible, groupId, userId } = this
        // if (visible && groupId) {
        //   this.fetchGroupViewList(groupId)
        // }
        if (!visible) {

        } else if (groupId) {
          this.fetchGroupViewList(groupId)
        } else if (userId) {
          this.fetchUserViewList(userId)
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
    /**
     * 用户当前授予的视图
     */
    async fetchUserViewList (userId) {
      try {
        let viewIdList
        if (userId === '超级管理员桌面') {
          this.dataSource = await getViewList({
            limit: 999
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
        } else {
          const groupViewList = await getViewListInUserAuth(userId).then(r => r.data.data)
          // console.log(groupViewList)
          viewIdList = groupViewList.map(el => Number(el.view_id))
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
        }
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
    },
    async submit () {
      const { _targetKeys, desktopId } = this
      try {
        this.loading = true
        await editDesktopContent(Number(desktopId), _targetKeys)
        this.$notification.success({
          message: '系统提示',
          description: '编辑桌面成功'
        })
        // this.visible = false
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
