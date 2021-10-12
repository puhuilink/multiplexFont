<template>
  <div class="forwardBind">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
      :afterClose="reset"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>

              <a-col :md="12" :sm="24">
                <a-form-item label="通知方式" v-bind="formItemLayout" class="fw">
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
                <a-form-item label="接收人" v-bind="formItemLayout" class="fw">
                  <!--                  <a-input allowClear v-model.trim="queryParams.contact" />-->
                  <a-select
                    placeholder="选择通知用户"
                    v-model="queryParams.contact">
                    <a-select-option
                      v-for="{value, label} in userList"
                      :key="value"
                      :value="value"
                    >
                      {{ label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="告警等级" v-bind="formItemLayout" class="fw">
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
import { LEVEL_LIST, LEVEL_MAPPING } from '../typing'
export default {
  name: 'InformConfig',
  mixins: [List],
  components: {
    SenderSchema
  },
  data () {
    return {
      LEVEL_MAPPING,
      visible: false,
      allMode: Object.freeze(
        Object.fromEntries(ALL_SEND_TYPE_MAPPING)
      ),
      levelList: LEVEL_LIST,
      sendMethod: [
        ['SMS', '短信'],
        ['EMAIL', '邮件'],
        ['SMS/EMAIL', '全部分类']
      ],
      columns: Object.freeze([
        {
          title: '告警等级',
          dataIndex: 'severity',
          width: 120,
          sorter: true,
          customRender: (severity) => LEVEL_MAPPING.get(severity)
        },
        {
          title: '通知组',
          dataIndex: 'group.group_name',
          width: 120
        },
        {
          title: '接收人',
          dataIndex: 'contact',
          width: 120,
          customRender: contact => _.join(_.split(contact, '/'), ' ')
        },
        {
          title: '通知方式',
          dataIndex: 'send_type',
          width: 120,
          customRender: send_type => this.$options.filters.sendTypeSwitch(send_type)
        }
      ]),
      userList: [],
      queryParams: {
        event_level: '',
        contact: '',
        send_type: ''
      }
    }
  },
  methods: {
    async getUser () {
      const { data } = await UserService.find({
        fields: [
          'label: staff_name',
          'value: user_id'
        ],
        data: 'userList'
      })
      this.userList = data.t_user
    },
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
  },
  mounted () {
    this.getUser()
  }
}
</script>

<style scoped>

</style>
