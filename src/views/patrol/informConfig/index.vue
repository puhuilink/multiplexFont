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
                  <a-select allowClear v-model.number="queryParams.severity" >
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
      @addSuccess="query"
    ></SenderSchema>
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { ALL_SEND_TYPE_MAPPING } from '@/tables/alarm_temp/types'
import { PatrolSenderService, UserService } from '@/api'
import SenderSchema from './modules/SenderSchema/index'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
export default {
  name: 'InformConfig',
  mixins: [List],
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
          dataIndex: 'severity',
          width: 120,
          sorter: true
        },
        {
          title: '通知组',
          dataIndex: 'group.group_name',
          width: 120
        },
        {
          title: '发送人',
          dataIndex: 'contact',
          width: 120,
          customRender: contact => contact
          //   async contact => {
          //   console.log(_.split(contact, '/'))
          //   const { data: { name } } = await UserService.find({
          //     where: {
          //       user_id: { _in: _.split(contact, '/') }
          //     },
          //     fields: ['staffName: staff_name'],
          //     alias: 'name'
          //   })
          //   console.log(_.join(name.map(el => el.staffName), '/'))
          //   return _.join(name.map(el => el.staffName), '/')
          // }
        },
        {
          title: '发送方式',
          dataIndex: 'send_type',
          width: 120,
          customRender: send_type => this.$options.filters.sendTypeSwitch(send_type)
        }
      ]),
      queryParams: {
        event_level: '',
        contact: '',
        send_type: ''
      }
    }
  },
  filters: {
    sendTypeSwitch (val) {
      switch (val) {
        case 'SMS':
          return '短信'
        case 'EMAIL':
          return '邮箱'
        case 'SMS/EMAIL':
          return '短信/邮箱'
        case 'EMAIL/SMS':
          return '短信/邮箱'
        default:
          return ''
      }
    }
  },
  methods: {
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => PatrolSenderService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    onAdd () {
      this.$refs.schema.add()
    },
    onEdit () {
      this.$refs.schema.edit(this.selectedRowKeys)
    },
    loadData (parameter) {
      const { ...restQueryParams } = this.queryParams
      return PatrolSenderService.find({
        where: {
          ...generateQuery({
            ...restQueryParams
          })
        },
        fields: [
          'id',
          'severity',
          'send_type',
          'group_id',
          'contact',
          'group { group_name }',
          'auto'
        ],
        alias: 'data',
        ...parameter
      }).then(async r => {
        r.data.data = await Promise.all(
          r.data.data.map(async el => {
            const userId = el.contact
            const { data: { name } } = await UserService.find({
              where: {
                user_id: { _in: _.split(userId, '/') }
              },
              fields: ['staffName: staff_name'],
              alias: 'name'
            })
            el.contact = _.join(name.map(el => el.staffName), '/')
            return el
          })
        )
        return r.data
      })
    }
  }
}
</script>

<style scoped>

</style>
