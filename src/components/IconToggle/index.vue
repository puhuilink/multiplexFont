<template>
  <a-popover title="Title" trigger="focus"  placement="bottom">
    <template slot="content">
      <!-- 图标项 -->
      <!--<div
        class="icon-item"
        v-for="item in options"
        :key="item"
        :class="{ 'is-active': isActive(item) }"
        @click="onClickSelected(item)">
        <i :class="item"></i>
      </div>-->
    </template>
    <a-button shape="circle" type="dashed" icon="setting">

    </a-button>
  </a-popover>
</template>

<script>
  export default {
    name: 'index'
  }
</script>

<style scoped>

</style>