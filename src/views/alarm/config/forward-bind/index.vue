<template>
  <div class="forwardBind">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
      show-pagination
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
        <a-button @click="onDetail">查看</a-button>
        <a-button @click="onAdd">新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit">编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete">删除</a-button>
      </template>
    </CTable>
    <SenderSchema
      @addSuccess="query(false)"
      @updateSuccess="query(false)"
      ref="schema"
    ></SenderSchema>
  </div>
</template>

<script>
import { List, Schema } from '@/components/Mixins'
import RuleMixin from '../ruleMixin'
import { ALL_SEND_TYPE_MAPPING } from '@/tables/alarm_temp/types'
import { AlarmSenderService, UserService } from '@/api'
import SenderSchema from './modules/SenderSchema/index'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'

export default {
  name: 'ForwardBind',
  mixins: [List, RuleMixin, Schema],
  components: {
    SenderSchema
  },
  data () {
    return {
      visible: false,
      listGroup: '',
      listUser: '',
      allMode: Object.freeze(
        Object.fromEntries(ALL_SEND_TYPE_MAPPING)
      ),
      levelList: [
        [1, '一级（紧急通知）'],
        [2, '二级（主要通知）'],
        [3, '三级（次要通知）'],
        [4, '四级（一般通知）']
      ],
      levelMap: {
        1: '一级（紧急通知）',
        2: '二级（主要通知）',
        3: '三级（次要通知）',
        4: '四级（一般通知）'
      },
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
          sorter: true,
          customRender: level => level ? this.levelMap[level] : ''
        },
        {
          title: '通知组',
          dataIndex: 'groupAlias',
          width: 120,
          customRender: (groupAlias) => {
            return groupAlias.group_name ? groupAlias.group_name : ''
          }
        },
        {
          title: '发送人',
          dataIndex: 'contact',
          width: 120,
          customRender: contact => _.join(contact.split('/'), ' ')
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
    onDetail () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.detail(id)
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
          'auto',
          'groupAlias: groupName { group_name }'
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
