<template>
  <div class="wd">
    <div style="display: flex;flex-direction: row-reverse;height: 3rem;">
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
      :pagination="{
        current: this.current,
        pageSize: this.pageSize,
        pageSizeOptions: ['10', '20'],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total,[start, end])=> `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onChange:(page, pageSize) =>{
          this.current = page
          this.pageSize = pageSize
          this.fetch(page, pageSize)
        },
        showSizeChange: (current, size) => {
          this.current = current
          this.pageSize = size
          this.fetch(current, pageSize)
        }
      }"
    >
      <!--      <span slot="customTitle"><a-tooltip title="使用该排班的分派策略、智能降噪或风暴预警"><a-icon type="info-circle" />关联信息</a-tooltip></span>-->
      <span slot="action" slot-scope="text, { id }">
        <a-button @click="onDetail(id)">查看</a-button>
        <a-divider type="vertical" />
        <a-button @click="onEdit(id)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此排班?"
          placement="left"
          @confirm="onDelete(id)"
          okText="确定"
          cancelText="取消"
        >
          <a-tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button>删除</a-button>
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
import toggleBtn from '@/components/Mixins/Table/Button/ToggleBtn'
import schema from './components/schema'
import detail from './components/detailSchema'
import { alarm } from '@/utils/request'
import moment from 'moment'
const format = 'YYYY-MM-DD hh:mm:ss'
const columns = [
  { title: '排班名称', dataIndex: 'name', key: 'name' },
  { title: '生效时间', dataIndex: 'effectiveTime', key: 'effectiveTime', customRender: el => moment(el).format(format) },
  { title: '最后一次编辑时间', dataIndex: 'updateTime', key: 'updateTime', customRender: (_, el) => _ || el.createTime },
  { title: '排班人员', dataIndex: 'creator', key: 'Tags' },
  { title: '操作', dataIndex: '', key: 'x', align: 'center' , width: '400', scopedSlots: { customRender: 'action' } }
]

const dataSource = []

export default {
  name: 'Index',
  components: { single, toggleBtn, schema, detail },
  data () {
    return {
      advanced: false,
      dataSource,
      columns,
      current: 0,
      pageSize: 10,
      loading: false,
      title: []
    }
  },
  methods: {
    changeBtn () {
      this.advanced = !this.advanced
    },
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
            nextCharger: el.next.staffName,
            nextTime: `${moment(el.next.startTime).format('YYYY-MM-DD hh:mm')}~${moment(el.next.endTime).format('YYYY-MM-DD hh:mm')}`
          }))
        } else {
          this.$notifyError(msg)
        }
      } catch (e) {
        throw e
      }
    },
    async fetch (page, size) {
      this.loading = true
      try {
        const { code, msg, data: { value, total } } = await alarm.post('/api/configuration/schedule/list', {
          paging: {
            limit: page,
            offset: size
          }
        })
        if (code === 200) {
          this.dataSource = value
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
    this.fetch(this.pageSize, this.current)
  }
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
    margin-bottom: 1rem;
  }
  &-fix {
    height: 80px;
   }

  &-btn {
    float: right;
  }
}
</style>
