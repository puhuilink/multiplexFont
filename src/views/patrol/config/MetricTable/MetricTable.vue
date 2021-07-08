<template>
  <a-modal
    title="编辑检查项"
    wrapClassName="MetricSchema"
    :visible="visible"
    @cancel="$emit('cancel',$event)"
    @close="$emit('close',$event)"
    @ok="$emit('ok',$event)"
  >
    <a-form layout="inline" :form="metricForm">
      <a-form-item
        label="检查项"
      >
        <a-input
          v-decorator="[
            'alias',
            { rules: [{ required: true, message: 'Please input your name' }] },
          ]"
          style="width: 110px"
        />
      </a-form-item>
      <a-form-item
        label="检查值"
      >
        <a-select
          v-decorator="[
            'metric_id',
            { rules: [{ required: true, message: 'Please input your name' }] },
          ]"
          style="width: 110px"
        >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0;" />
            <div
              style="padding: 4px 8px; cursor: pointer;"
              @mousedown="e => e.preventDefault()"
              @click="navigatorToEditMetric"
            >
              <a-icon type="edit" />
              编辑
            </div>
          </div>
          <a-select-option
            v-for="a in Object.values(answers)"
            :key="a.id"
            :value="a.id"
          >
            {{ a.alias }}
          </a-select-option>

        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" >
          新建
        </a-button>
      </a-form-item>
    </a-form>
    <a-table
      :data-source="Object.values(metrics)"
      :pagination="pagination"
      :columns="metricColumns"
      key="metric_id"
    >
      <template slot="metric_alias" slot-scope="text, record">
        <span v-if="record.editable">
          <a-input v-model="tempMetric.metric_alias" style="width: 100%;"/>
        </span>
        <span v-else>
          {{ record.alias }}
        </span>
      </template>
      <template slot="answer" slot-scope="text, record">
        <span v-if="record.editable">
          <a-select v-model="tempMetric.answer_id" style="width: 100%;">
            <a-select-option v-for="a in Object.values(answers)" :key="a.id" :value="a.id">{{ a.alias
            }}</a-select-option>
          </a-select>
        </span>
        <span v-else>
          {{ answers[record['answer_id']].alias }}
        </span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.id)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认取消?" @confirm="() => cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="editingKey !== ''" @click="() => deleteMetric(record.id)">删除</a>
          </span>
        </div>
      </template>

    </a-table>
  </a-modal>
</template>

<script>
export default {
  name: 'MetricTable',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    answers: {
      type: Object,
      default: () => {}
    },
    metrics: {
      type: Object,
      default: () => {}
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      editingKey: '',
      metricForm: this.$form.createForm(this, {
        alias: '',
        answer_id: ''
      }),
      metricColumns: [
        {
          title: '',
          dataIndex: 'metric_alias',
          width: '25%',
          scopedSlots: { customRender: 'metric_alias' }
        },
        {
          title: '',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tempMetric: {
        metric_alias: '',
        answer_id: ''
      },
      tempAnswer: {
        id: '',
        alias: '',
        format: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    edit (id) {
      this.metrics[id].editable = true
      this.editingKey = id
      this.tempMetric.metric_alias = this.metrics[id].alias
      this.tempMetric.answer_id = this.metrics[id].answer_id
      this.$forceUpdate()
    },
    deleteMetric (id) {
      delete this.metrics[id]
      this.$forceUpdate()
    },
    save (id) {
      this.metrics[id].editable = false
      this.editingKey = ''
      this.metrics[id].alias = this.tempMetric.metric_alias
      this.metrics[id].answer_id = this.tempMetric.answer_id
      this.$forceUpdate()
      this.$emit('change', this.metrics)
    },
    cancel (id) {
      this.metrics[id].editable = false
      this.editingKey = ''
      this.tempMetric = {
        metric_alias: '',
        answer_id: ''
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="less">

</style>
