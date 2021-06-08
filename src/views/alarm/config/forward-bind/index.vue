<template>
  <div class="forwardBind">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>

              <a-col :md="12" :sm="24">
                <a-form-item label="发送方式" v-bind="formItemLayout" class="fw">
                  <a-select allowClear v-model="queryParams.send_type" >
                    <a-select-option
                      v-for="[value, label] in sendMethod"
                      :value="value"
                      :key="value"
                    >{{ label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="发送人" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.contact" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="通知等级" v-bind="formItemLayout" class="fw">
                  <a-select allowClear v-model.number="queryParams.event_level" >
                    <a-select-option
                      v-for="[value, label] in levelList"
                      :value="value"
                      :key="value"
                    >{{ label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAdd">新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit">编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete">删除</a-button>
      </template>
    </CTable>
    <SenderSchema
      ref="schema"
    ></SenderSchema>
  </div>
</template>

<script>
import { List, Schema } from '@/components/Mixins'
import RuleMixin from '../ruleMixin'
import { ALL_SEND_TYPE_MAPPING } from '@/tables/alarm_temp/types'
import { AlarmSenderService } from '@/api'
import SenderSchema from './modules/SenderSchema/index'
import { generateQuery } from '@/utils/graphql'
export default {
  name: 'ForwardBind',
  mixins: [List, RuleMixin, Schema],
  components: {
    SenderSchema
  },
  data () {
    return {
      visible: false,
      allMode: Object.freeze(
        Object.fromEntries(ALL_SEND_TYPE_MAPPING)
      ),
      levelList: [
        [1, '一级（紧急通知）'],
        [2, '二级（主要通知）'],
        [3, '三级（次要通知）'],
        [4, '四级（一般通知）']
      ],
      sendMethod: [
        ['SMS', '短信'],
        ['EMAIL', '邮件'],
        ['SMS/EMAIL', '全部分类']
      ],
      columns: Object.freeze([
        {
          title: '通知等级',
          dataIndex: 'event_level',
          width: 120,
          sorter: true
        },
        {
          title: '通知组',
          dataIndex: 'group_id',
          width: 120
        },
        {
          title: '发送人',
          dataIndex: 'contact',
          width: 120
        },
        {
          title: '发送方式',
          dataIndex: 'send_type',
          width: 120
        }
      ]),
      queryParams: {
        event_level: '',
        contact: '',
        send_type: ''
      }
    }
  },
  methods: {
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => AlarmSenderService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    loadData (parameter) {
      const { ...restQueryParams } = this.queryParams
      return AlarmSenderService.find({
        where: {
          ...generateQuery({
            ...restQueryParams
          })
        },
        fields: [
          'id',
          'event_level',
          'send_type',
          'group_id',
          'contact',
          'source',
          'auto'
        ],
        alias: 'data',
        ...parameter
      }).then(r => r.data)
    }
  }
}
</script>

<style scoped>

</style>
