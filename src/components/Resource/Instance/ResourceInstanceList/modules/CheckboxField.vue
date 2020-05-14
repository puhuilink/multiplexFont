<template>
  <a-form-item
    :labelCol="{ span: 8 }"
    :bind="formItemProps"
    style="width: 100%"
  >
    <a-checkbox v-model="field.value">
      {{ field.name }}
    </a-checkbox>
  </a-form-item>
</template>

<script>
export default {
  name: 'CheckboxField',
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
