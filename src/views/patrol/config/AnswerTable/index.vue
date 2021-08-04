<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="Object.values(this.answers)"
      :pagination="pagination"
      key="id"
    >
      <template slot="format" slot-scope="text">
        <a-row :key="index" v-for="(a,index) in Object.values(JSON.parse(text))">
          <a-card style="width: 30%">{{ a.alias }}</a-card><a-card style="width: 30%">{{ a.value }}</a-card>
        </a-row>
      </template>
      <template slot="type" slot-scope="text">
        {{ text==='select'?'选择':'填写' }}
      </template>
    </a-table>
  </div>
</template>

<script>
import { dealQuery } from '@/utils/util'
import { sql } from '@/utils/request'

export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      data: [],
      columns: [
        {
          title: '检查值',
          dataIndex: 'alias'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '值映射',
          dataIndex: 'format',
          scopedSlots: { customRender: 'format' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      answers: {},
      pagination: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.fetchAnswer()
  },
  mounted () {

  },
  methods: {
    async fetchAnswer () {
      const base_sql = 'select * from t_patrol_answer where 1=1'
      const data = dealQuery(await sql(base_sql))
      this.answers = {}
      for (let i = 0; i < data.length; i++) {
        const answer = data[i]
        this.answers[answer.id] = answer
      }
      console.log(this.answers)
    }
  }
}
</script>

<style scoped lang="less">
</style>
