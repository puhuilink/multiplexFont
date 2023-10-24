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
        <div>{{ `${path.pathName}-${zone.zoneName}` }}</div>
        <a-select class="OrderTitle__select" placeholder="选择点位"></a-select>
        <a-select class="OrderTitle__select" placeholder="选择设备"></a-select>
        <a-select class="OrderTitle__select" placeholder="选择检查实体"></a-select>
      </div>
      <Container @drop="onDrop">
        <Draggable v-for="item in items" :key="item.id">
          <div class="draggable-item">
            {{ item.data }}
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

const generateItems = (count, creator) => {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(creator(i))
  }
  return result
}

export default {
  name: 'OrderSchema',
  components: { Container, Draggable },
  data () {
    return {
      guardItem: [],
      items: [{ id: 1, data: 'Draggable1' }, { id: 2, data: 'Draggable2' }, { id: 3, data: 'Draggable3' }],
      formState: {},
      operationArray: [],
      visible: false,
      modalTitle: '',
      path: {},
      zone: {},
      answerOptions: [],
      requestSubmit: () => {},
      labelCol: {
        xs: { span: 14 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 12 }
      }
    }
  },
  methods: {
    backRenderDraggable (index) {

    },
    renderDraggable (item) {
      this.guardItem.push({ pathId: item.id, alias: item.alias })
    },
    reorder (pathId, zoneId) {
      this.visible = true
      this.modalTitle = '调整顺序'
      this.requestSubmit = this.requestEdit
      this.guardItem = []
      this.pathId = pathId
      this.zoneId = zoneId
    },
    async requestEdit () {
      const result = await xungeng.post('/path/editPath', this.formState)
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
    width: 30% !important;
    margin-right: 15px
  }
}
</style>
