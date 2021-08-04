<template>
  <div>
    <div class="PatrolConfig__operation">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col
            :span="8"
          >
            <a-form-item :label="`监控对象`">
              <a-input
                v-decorator="[
                  ``,
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Input something!',
                      },
                    ],
                  },
                ]"
                placeholder="placeholder"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">
              Search
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              Clear
            </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              Collapse <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row>
      </a-form>
      <a-button type="primary">新增阈值规则</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :rowKey="record=>record.id"
    >
      <template slot="endpoint" slot-scope="value,record">{{ record.visible==='t'?value:'虚拟实体' }}</template>
      <template slot="value" slot-scope="value,record">{{ translateThreshold(record) }}</template>
      <template slot="action" slot-scope="value,record">
        <a-button type="primary" @click="updateThreshold(record.id)">修改</a-button>
        <a-divider type="vertical"/>
        <a-button type="primary" @click="deleteThreshold(record.id)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { dealQuery } from '@/utils/util'
import { sql } from '@/utils/request'

export default {
  name: 'PatrolThreshold',
  components: {},
  props: {},
  data () {
    return {
      queryParams: {},
      pagination: {},
      columns: [
        {
          title: '监控对象',
          dataIndex: 'host_alias',
          scopedSlots: { customRender: 'host' }
        },
        {
          title: '监控实体',
          dataIndex: 'endpoint_alias',
          scopedSlots: { customRender: 'endpoint' }
        },
        {
          title: '检查项',
          dataIndex: 'metric_alias',
          scopedSlots: { customRender: 'metric' }
        },
        {
          title: '检查值',
          dataIndex: 'answer_alias',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '阈值',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      loading: false,
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' })
    }
  },
  computed: {
    count () {
      return this.expand ? 11 : 7
    }
  },
  watch: {},
  created () {
    this.fetchThreshold()
  },
  mounted () {
  },
  methods: {
    handleSearch (e) {},
    async fetchThreshold (condition_sql = null) {
      let base_sql = `select * from v_patrol_threshold where 1=1`
      if (condition_sql !== null) {
        base_sql += condition_sql
      }
      this.loading = true
      this.data = dealQuery(await sql(base_sql))
      this.loading = false
    },
    handleReset () {
      this.form.resetFields()
    },

    toggle () {
      this.expand = !this.expand
    },
    translateThreshold (record) {
      switch (record.condition) {
        case 'eq':
          return '值为"' + JSON.parse(record.format)[record.lower_threshold].alias + '"则异常'
        case 'ne':
          return '值不为"' + JSON.parse(record.format)[record.lower_threshold].alias + '"则异常'
        case 'out':
          return '值超出"' + record.lower_threshold + '~' + record.upper_threshold + '"范围则异常'
        case 'gt':
          return '值大于"' + record.upper_threshold + '"则异常'
        case 'lt':
          return '值小于"' + record.lower_threshold + '"则异常'
      }
    },
    updateThreshold () {},
    deleteThreshold () {}
  }
}
</script>

<style scoped lang="less">
</style>
