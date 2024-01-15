<template>
  <div class="main">
    <draggable v-model="list" axis="x" class="main">
      <div v-for="(item, index) in list" :key="index" class="draggable-item">
        {{ item }}
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data () {
    return {
      list: ['Item 1', 'Item 2', 'Item 3', 'Item 4']
    }
  }
}
</script>

<style>
.main {
  display: flex;
}
.draggable-item {
  width: 100px;
  height: 50px;
  background-color: #eee;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}
</style>
