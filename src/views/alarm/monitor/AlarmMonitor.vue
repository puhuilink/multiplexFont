/**
 *告警监控
 *Author: yizhu liu
 *Date: 2019-12-03 14:13:22
 *Email: lyz02413@163.com
 */
<template>
  <div class="alarm-monitor">
    <a-card
      style="width:100%"
      :tabList="tabList"
      :activeTabKey="'key'"
      @tabChange="key => onTabChange(key, 'key')"
    >
      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="CI域">
                <a-select
                  v-model="queryParam.CIDomain"
                  placeholder="请选择CI域"
                >
                  <a-select-opt-group
                    v-for="(group,index) in CIDomain"
                    :key="index"
                    :label="group.label"
                  >
                    <a-select-option
                      v-for="item in group.options"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="CI类型">
                <a-select
                  v-model="queryParam.CIType"
                  placeholder="请选择CI类型"
                >
                  <a-select-opt-group
                    v-for="(group,index) in CIType"
                    :key="index"
                    :label="group.label"
                  >
                    <a-select-option
                      v-for="item in group.options"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'AlarmMonitor',
  data () {
    return {
      tabList: [
        {
          key: 'pending',
          tab: '待处理告警'
        },
        {
          key: 'confirmed',
          tab: '已确认告警'
        },
        {
          key: 'shifting',
          tab: '已前转告警'
        },
        {
          key: 'resolved',
          tab: '已解决告警'
        },
        {
          key: 'ignore',
          tab: '已忽略告警'
        }
      ],
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 筛选项：CI域
      CIDomain: [
        {
          label: 'Root',
          options: [{
            value: 'rootDamin',
            label: 'rootDamin'
          }]
        }, {
          label: 'rootDamin',
          options: [{
            value: 'bj',
            label: '北京运维组'
          },
          {
            value: 'xm',
            label: '厦门运维组'
          }]
        }
      ],
      // 筛选项：CI类型
      CIType: [
        {
          label: 'Root',
          options: [{
            value: '0',
            label: '统一资源'
          }]
        },
        {
          label: 'CI',
          options: [{
            value: '1',
            label: '管理'
          },
          {
            value: '2',
            label: '监控定义'
          },
          {
            value: '3',
            label: '监控对象'
          },
          {
            value: '4',
            label: '告警'
          },
          {
            value: '5',
            label: '性能'
          }]
        },
        {
          label: 'Manager',
          options: [{
            value: '6',
            label: '字典数据'
          }]
        }
      ],
      // 筛选项: CI实例
      CIinstance: [

      ]
    }
  },
  methods: {
    onTabChange (key, type) {
      console.log(key, type)
      this[type] = key
    }
  }
}
</script>

<style scoped lang="less">

</style>
