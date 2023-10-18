<template>
  <div>
    <div class="simple-page">
      <Container @drop="onDrop">
        <Draggable v-for="item in items" :key="item.id">
          <div class="draggable-item">
            {{ item.data }}
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'

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
  name: 'SimpleDraggable',
  components: { Container, Draggable },
  data () {
    return {
      items: generateItems(50, i => ({ id: i, data: 'Draggable ' + i }))
    }
  },
  methods: {
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
</style>
