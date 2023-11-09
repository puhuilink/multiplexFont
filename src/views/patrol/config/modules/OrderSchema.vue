<template>
  <div>
    <a-modal
      class="simple-page"
      :title="modalTitle"
      wrapClassName="HostSchema"
      :visible="visible"
      width="800px"
      centered
      v-if="visible"
      @ok="requestSubmit"
      @cancel="handleCancel"
      @close="handleCancel">
      <div class="OrderTitle">
        <a-form-model ref="ruleForm" layout="inline">
          <a-form-model-item label="点位">
            <a-select class="OrderTitle__select" placeholder="选择点位" v-model="formState.checkpointId" :options="checkpoints" @change="queryList(0)"/>
          </a-form-model-item>
          <a-form-model-item label="设备">
            <a-select class="OrderTitle__select" placeholder="选择设备" v-model="formState.hostId" :options="hosts" @change="queryList(1)"/>
          </a-form-model-item>
          <a-form-model-item label="检查实体">
            <a-select class="OrderTitle__select" placeholder="选择检查实体" v-model="formState.endpointId" :options="endpoints" @change="queryList(2)"/>
          </a-form-model-item>
        </a-form-model>
      </div>
      <Container @drop="onDrop">
        <Draggable v-for="item in items" :key="item.id">
          <div class="draggable-item">
            {{ item.alias }}
          </div>
        </Draggable>
      </Container>
    </a-modal>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { xungeng } from '@/utils/request'

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

export default {
  name: 'OrderSchema',
  components: { Container, Draggable },
  data () {
    return {
      checkpoints: [],
      hosts: [],
      endpoints: [],
      items: [],
      formState: { checkpointId: '', hostId: '', endpointId: '' },
      operationArray: [],
      visible: false,
      modalTitle: '',
      path: {},
      zone: {},
      currentType: '',
      answerOptions: [],
      requestSubmit: () => {},
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 6 }
      }
    }
  },
  methods: {
    isBlank (element) {
      return element !== null && element !== undefined && element !== ''
    },
    backRenderDraggable (index) {

    },
    renderDraggable (item) {
      this.guardItem.push({ pathId: item.id, alias: item.alias })
    },
    reorder (path, zone) {
      this.visible = true
      this.modalTitle = '调整顺序'
      this.requestSubmit = this.requestEdit
      this.path = path
      this.zone = zone
      this.formState = { checkpointId: '', hostId: '', endpointId: '' }
      this.items = []
      this.queryCheckpoint()
    },
    queryList (type) {
      const { checkpointId, hostId, endpointId } = this.formState
      if (type === 2) {
        this.queryMetric({ pathId: this.path.pathId, endpointId })
        return
      }
      if (type === 1) {
        this.endpoints = []
        this.formState.endpointId = ''
        this.queryEndpoint({ pathId: this.path.pathId, hostId })
        return
      }
      if (type === 0) {
        this.hosts = []
        this.endpoints = []
        this.formState.endpointId = ''
        this.formState.hostId = ''
        this.queryHost({ pathId: this.path.pathId, checkpointId })
      }
    },
    async queryMetric (args) {
      const res = await xungeng.post('path/findSequence', args)
      if (res.code === 200) {
        this.items = res.data.map(data => ({ id: data.metricId, alias: data.metricAlias, sequence: data.metricSequence }))
        this.currentType = 'metric'
      }
    },
    async queryEndpoint (args) {
      const res = await xungeng.post('path/findSequence', args)
      if (res.code === 200) {
        this.items = res.data.map(data => ({ id: data.endpointId, alias: data.endpointAlias, sequence: data.endpointSequence }))
        this.endpoints = res.data.map(data => ({ key: data.endpointId, label: data.endpointAlias }))
        this.currentType = 'endpoint'
      }
    },
    async queryHost (args) {
      const res = await xungeng.post('path/findSequence', args)
      if (res.code === 200) {
        this.items = res.data.map(data => ({ id: data.hostId, alias: data.hostAlias, sequence: data.hostSequence }))
        this.hosts = res.data.map(data => ({ key: data.hostId, label: data.hostAlias }))
        this.currentType = 'host'
      }
    },
    async queryCheckpoint () {
      const { pathId } = this.path
      const res = await xungeng.post('path/findSequence', { pathId })
      if (res.code === 200) {
        this.checkpoints = res.data.map(data => ({ key: data.checkpointId, label: data.checkpointAlias }))
      }
    },
    async requestEdit () {
      const result = await xungeng.post('/path/updateSequence', this.formatItems())
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '巡更路径变更成功'
        })
        this.$emit('refresh')
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
      this.visible = false
    },
    formatItems () {
      switch (this.currentType) {
        case 'host': {
          return this.items.map((item, index) => ({
            'pathId': this.path.pathId,
            'hostId': item.id,
            'hostSequence': index
          }))
        }
        case 'endpoint': {
          return this.items.map((item, index) => ({
            'pathId': this.path.pathId,
            'endpointId': item.id,
            'endpointSequence': index
          }))
        }
        case 'metric': {
          return this.items.map((item, index) => ({
            'pathId': this.path.pathId,
            'metricId': item.id,
            'metricSequence': index
          }))
        }
      }
    },
    handleCancel () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
      this.$emit('refresh')
    },
    onDrop (dropResult) {
      this.items = applyDrag(this.items, dropResult)
    }
  }
}

</script>

<style>
.draggable-item {
  height: 50px;
  line-height: 50px;
  text-align: center;
  display: block;
  background-color: #fff;
  outline: 0;
  border: 1px solid rgba(0, 0, 0, .125);
  margin-bottom: 2px;
  margin-top: 2px;
  cursor: default;
  user-select: none;
}
.OrderTitle{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  .OrderTitle__select{
    width: 150px !important;
    margin-right: 15px
  }
}
</style>
