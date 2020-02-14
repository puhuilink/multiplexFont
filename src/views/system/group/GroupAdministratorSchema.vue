<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    :width="720"
    wrapClassName="GroupAdministratorSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-transfer
      :dataSource="mockData"
      showSearch
      :filterOption="filterOption"
      :targetKeys="targetKeys"
      @change="handleChange"
      @search="handleSearch"
      :render="item => item.title"
    >
    </a-transfer>
  </a-modal>
</template>

<script>
// 组管理员必须是组内成员

export default {
  name: 'GroupAdministratorSchema',
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    loading: false,
    record: null,
    title: '',
    visible: false,
    // 所有数据
    mockData: [],
    // 选中数据
    targetKeys: []
  }),
  mounted () {
    this.getMock()
  },
  methods: {
    getMock () {
      const targetKeys = []
      const mockData = []
      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1
        }
        if (data.chosen) {
          targetKeys.push(data.key)
        }
        mockData.push(data)
      }
      this.mockData = mockData
      this.targetKeys = targetKeys
    },
    /**
       * 过滤条件
       * @param inputValue
       * @param option
       * @return {boolean}
       */
    filterOption (inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    handleChange (targetKeys, direction, moveKeys) {
      // console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    },
    edit (record) {
      this.title = '设置组管理员'
      this.visible = true
    },
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
  .GroupAdministratorSchema__modal {
    .ant-modal-body {
      /*padding-top: 0;*/
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
