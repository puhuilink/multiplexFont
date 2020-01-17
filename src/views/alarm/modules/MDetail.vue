/*
 * 告警监控信息详情
 */
<template>
  <a-modal
    title="告警信息"
    style="top: 40px;"
    :bodyStyle="{padding:'12px!important', maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    @cancel="handleCancel"
  >
    <a-card
      style="100%"
      :tabList="tabList"
      :activeTabKey="key"
      :bordered="false"
      @tabChange="key => onTabChange(key, 'key')"
    >
      <a-row v-if="key=='0'" class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警编号">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="级别">
            <a-input disabled :defaultValue="record.level" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="CI名称">
            <a-input disabled :defaultValue="record.CIName" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="应用名称">
            <a-input disabled :defaultValue="record.appName" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="首次告警时间">
            <a-input disabled :defaultValue="record.firstArisingTime" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="最近告警时间">
            <a-input disabled :defaultValue="record.arisingTime" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转时间">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="关闭人">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="关闭时间">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="处理人">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="工单编号">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="采集系统">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="事件编号">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="消息内容">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="备注">
            <a-input disabled defaultValue="" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-else class="form-row" :gutter="16" >
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="原始事件编号">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="首次级别编号">
            <a-input disabled :defaultValue="record.level" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="接收时间">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="更新时间">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col><a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警类型">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col><a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警类型编号">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="辅助节点编号">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="节点类型">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="关联告警">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="子告警">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="KPI编号">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="KPI数值">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="KPI单位">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警标记">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="关键补充">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="工单状态">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="来源实例1">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="来源实例2">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="故障编号">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="活动状态">
            <a-input disabled :defaultValue="record.code" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <template slot="footer" >
      <a-button v-if="mode=='monitorSee'" @click="handleCancel">前转</a-button>
      <a-button v-if="mode=='monitorSee'" @click="handleCancel">解决</a-button>
      <a-button v-if="mode=='monitorSee'" @click="handleCancel">事件查询</a-button>
      <a-button v-if="mode=='monitorSee'" @click="handleCancel">操作日志</a-button>
      <a-button v-if="mode=='monitorSee'" @click="handleCancel">关联告警</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'MDetail',
  data () {
    return {
      tabList: [
        {
          key: '0',
          tab: '基本信息'
        },
        {
          key: '1',
          tab: '其他信息'
        }
      ],
      key: '0',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      loading: false,
      record: '',
      mode: ''
    }
  },
  methods: {
    open (record, mode) {
      this.visible = true
      this.record = record
      this.mode = mode
    },
    handleDetail (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
    }
  }
}
</script>

<style lang="less" scoped>
</style>
