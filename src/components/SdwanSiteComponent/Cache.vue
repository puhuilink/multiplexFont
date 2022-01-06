<template>
  <div>
    <a-form-model-item label="使用缓存">
      <a-switch
        checkedChildren="显示"
        unCheckedChildren="不显示"
        v-model="model.isCache"
        @change="statusChanged"
      />
    </a-form-model-item>
    <a-form-model-item
      label="缓存数据名称"
      v-if="state"
    >
      <a-input
        v-model="model.cache"
      ></a-input>
    </a-form-model-item>
  </div>
</template>

<script>
export default {
  name: 'Cache',
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      state: false
    }
  },
  methods: {
    statusChanged (value) {
      this.state = value
    }
  }
}
</script>

<style scoped>

</style>
