/*
 * 巡更  路线管理 新增/编辑
 */
<template>
  <a-modal
    :title="mode=='New'?'新增':mode=='See'?'详情':'编辑'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="1200"
    :visible="visible"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <template>
      <a-row>
        <a-col
          :xs="{ span: 8}"
          :lg="{ span: 8 }"
          class=""
        >
          路线名称：
          <a-input placeholder="请输入" style="width: 240px"/>
        </a-col>
        <a-col
          :xs="{ span: 8}"
          :lg="{ span: 8 }"
          class=""
        >
          巡更区域：
          <a-select
            allowClear
            style="width: 240px"
            placeholder="请选择"
            default-value=""
          >
            <a-select-option
              v-for="item in ascriptionList"
              :key="item.code"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-row :gutter="16" style="margin-top:20px">
        <a-col :span="8">
          <a-card title="点位" :bordered="true">
            <a-icon
              type="plus-circle"
              slot="extra"
              style="fontSize:18px"
            />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="对象" :bordered="true">
            <a-icon
              type="plus-circle"
              slot="extra"
              style="fontSize:18px"
            />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="检查项" :bordered="true">
            <a-icon
              type="plus-circle"
              slot="extra"
              style="fontSize:18px"
            />
          </a-card>
        </a-col>
      </a-row>

      <a-divider>机房点位图</a-divider>
      <a-card :bordered="false" hoverable style="width: 90%; margin:auto;">
        <img
          alt="example"
          src="@/assets/images/MachineRoom-BJ.jpg"
          slot="cover"
        />
      </a-card>
    </template>

    <template slot="footer" >
      <a-button v-if="mode!=='See'" @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

  </a-modal>
</template>

<script>
export default {
  name: 'RMDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      ascriptionList: [
        {
          code: 'MachineRoom-BJ',
          name: '北京机房'
        },
        {
          code: 'MachineRoom-XM',
          name: '厦门机房'
        }
      ],
      record: '',
      // 开启的父级操作来源
      mode: ''
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
    // this.form.setFieldsValue(record)
  },
  beforeMount () {
  },
  methods: {
    async open (record, mode) {
      this.visible = true
      this.record = record
      console.log(record, mode)
      this.mode = mode
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    /**
     * 表单效验
     */
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
