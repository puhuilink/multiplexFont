<template>
  <div class="wd">
    <div style="display: flex;height: 2rem;margin-left: 22px">
      <a-button @click="onAdd" type="primary" size="large">新建排班</a-button>
    </div>

    <div :class="[advanced ? 'upper-fix' : 'upper-flex', 'upper-common']">
      <a-row
        v-for="(item, index) in title"
        :key="index"
        type="flex"
        justify="center"
        :class="index === title.length - 1 ? '' : 'upper-fix'">
        <a-col :span="24">
          <single :source="item"></single>
        </a-col>
      </a-row>
    </div>
    <!--    <toggleBtn :advanced="advanced" @click="changeBtn" class="upper-btn" style="color: #000"></toggleBtn>-->

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      bordered
      rowKey="id"
      :locale="locale"
      :scroll="{y: scrollY}"
      :pagination="paginationOpt"
      class="button_sty ruleTable"
    >
      <!--      <span slot="customTitle"><a-tooltip title="使用该排班的分派策略、智能降噪或风暴预警"><a-icon type="info-circle" />关联信息</a-tooltip></span>-->
      <span slot="action" slot-scope="text, { id }">
        <a @click="onDetail(id)"><img src="@/assets/icons/icon_search.png"></a>
        <a-divider type="vertical" />
        <a @click="onEdit(id)"><img src="@/assets/icons/icon_edit.png"></a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此排班?"
          placement="left"
          @confirm="onDelete(id)"
          okText="提交"
          cancelText="取消"
        >
          <a-tooltip placement="top">
            <img src="@/assets/icons/icon_delet.png">
          </a-tooltip>
        </a-popconfirm>
      </span>
    </a-table>
    <schema ref="schema" @addSuccess="fetch(10,0)" @editSuccess="fetch(10, 0)"></schema>
    <detail ref="detail"></detail>
  </div>
</template>

<script>
/* eslint-disable */
import single from './components/singlePlan'
import List from '~~~/Mixins/Table/List'
import toggleBtn from '@/components/Mixins/Table/Button/ToggleBtn'
import schema from './components/schema'
import detail from './components/detailSchema'
import { alarm } from '@/utils/request'
import moment from 'moment'
import { decrypt } from '@/utils/aes'
const format = 'YYYY-MM-DD hh:mm:ss'
const columns = [
  { title: '排班名称', align: 'center', dataIndex: 'name', key: 'name' },
  { title: '生效时间', align: 'center', dataIndex: 'effectiveTime', key: 'effectiveTime', customRender: el => moment(el).format(format) },
  { title: '最后一次编辑时间', align: 'center', dataIndex: 'updateTime', key: 'updateTime', customRender: (_, el) => _ || el.createTime },
  { title: '排班人员', width: 200, align: 'center', dataIndex: 'tags', key: 'tags' },
  { title: '操作', dataIndex: '', key: 'x', align: 'center' , width: '700', scopedSlots: { customRender: 'action' } }
]

const dataSource = []

export default {
  name: 'Index',
  components: { single, toggleBtn, schema, detail },
  mixins: [List],
  data () {
    return {
      advanced: false,
      dataSource,
      locale: {
        emptyText: <a-empty></a-empty>
      },
      columns,
      loading: false,
      title: [],
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '30'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.defaultCurrent = 1
          this.paginationOpt.defaultPageSize  = pageSize
          this.fetch()
        },
        onChange:(current, pageSize) =>{
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = pageSize
          this.fetch()
        }
      }
    }
  },
  methods: {
    onEdit (id) {
      this.$refs.schema.edit(id)
    },
    onAdd () {
      this.$refs.schema.add()
    },
    onDetail (id) {
      this.$refs.detail.onShow(id)
    },
    async onDelete (id) {
      try {
        const { msg, code } = await alarm.post('/api/configuration/schedule/delete', { id: id })
        if (code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '删除成功'
          })
          await this.fetch(10, 0)
        } else {
          this.$notifyError(msg)
        }
      } catch (e) {
        throw e
      }
    },
    async fetchTitle () {
      try {
        const { code, msg, data } = await alarm.get('/api/configuration/schedule/title')
        if (code === 200) {
          this.title = data.map(el => ({
            label: el.current.name,
            currentCharger: el.current.staffName,
            currentTime: `${moment(el.current.startTime).format('YYYY-MM-DD hh:mm')}~${moment(el.current.endTime).format('YYYY-MM-DD hh:mm')}`,
            nextCharger: _.get(el, 'next.staffName', ''),
            nextTime: _.get(el, 'next.startTime', '').length ? `${moment(el.next.startTime).format('YYYY-MM-DD hh:mm')}~${moment(el.next.endTime).format('YYYY-MM-DD hh:mm')}` : '暂无'
          }))
        } else {
          this.$notifyError(msg)
        }
      } catch (e) {
        throw e
      }
    },
    async fetch () {
      this.loading = true
      try {
        const { defaultCurrent, defaultPageSize } = this.paginationOpt
        const { code, msg, data: { value, total } } = await alarm.post('/api/configuration/schedule/list', {
          paging: {
            limit: defaultPageSize,
            offset: defaultPageSize * ( defaultCurrent - 1 ),
          }
        })
        if (code === 200) {
          this.dataSource = value
          this.paginationOpt.total = total
          await this.fetchTitle()
        } else {
          this.$notifyError(msg)
        }
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.fetch()
  }
  // async beforeCreate () {
  //   try {
  //     const { data } = await alarm.get('/api/authentication/auth/get')
  //     const deData = decrypt(data)
  //     if (deData === '2') {
  //       await this.$router.push({ name: '600' })
  //     }
  //   } catch (e) {
  //     await this.$router.push({ name: '600' })
  //   }
  // }
}
</script>

<style lang="less" scoped>
.wd {
  width: 100%;
}
.upper {
  &-common {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    background-color: grey;
    opacity: 0.5;
    padding: 20px;
    overflow: hidden;
    border-radius: 5px;
    width: 96%;
    margin: 0 auto;
    margin-bottom: 4px;
  }
  &-fix {
    height: 80px;
   }

  &-btn {
    float: right;
  }
}
.button_sty {
  .ant-btn {
    min-width: 60px !important;
  }
}
</style>
