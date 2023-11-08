<template>
  <a-modal
    :title="modalTitle"
    width="900px"
    :visible="visible"
    @ok="closeModal"
    @cancel="closeModal"
    @close="closeModal"
  >
    <a-table
      style="width: 100%"
      :locale="{emptyText:' '}"
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :row-key="(record,index) => index"
    >
      <template slot="action" slot-scope="value,record">
        <a @click="toUpdate(record)"><a-icon type="form" />阈值批量修改</a>
        <a-divider type="vertical" />
        <a @click="toUpdateNull(record)"><a-icon type="highlight" />阈值批量置空</a>
      </template>
    </a-table>
    <BatchThresholdSchema
      ref="batchEditSchema"
      @refresh="fetchThreshold"
    />
  </a-modal>
</template>

<script>

import { xungeng } from '@/utils/request'
import _ from 'lodash'
import BatchThresholdSchema from '@/views/patrol/config/ThresholdConfig/modules/BatchThresholdSchema.vue'

export default {
  name: 'BatchThresholdTable',
  components: { BatchThresholdSchema },
  props: {},
  data () {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return {
      loading: false,
      columns: [
        {
          title: '检查项',
          dataIndex: 'metricAlias',
          scopedSlots: { customRender: 'metric' }
        },
        {
          title: '检查值',
          dataIndex: 'answerAlias',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      visible: false,
      parentData: {},
      pathId: '',
      editForm: {
        id: '',
        condition: '',
        lowerThreshold: '',
        upperThreshold: '',
        severity: ''
      },
      handleOk: () => {},
      formItemLayout,
      modalTitle: '编辑阈值规则',
      fetching: false
    }
  },
  created () {
  },

  mounted () {},
  computed: {},
  methods: {
    toUpdate (record) {
      this.$refs.batchEditSchema.openModal(record)
    },
    toUpdateNull (record) {
      this.$refs.batchEditSchema.batchEditNull(record)
    },
    async fetchThreshold () {
      this.loading = true
      const { pathId } = this
      const result = await xungeng.get('/threshold/listBatchThreshold', { params: { pathId } })
      this.data = result.data
      this.loading = false
    },
    openModal (pathId) {
      this.pathId = pathId
      this.fetchThreshold()
      this.visible = true
    },
    closeModal () {
      this.visible = false
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">

</style>
