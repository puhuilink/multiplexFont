<template>
  <a-form-item
    :labelCol="{ span: 8 }"
    v-bind="formItemProps"
    style="width: 100%"
  >
    <a-checkbox v-model="field.value">
      {{ field.label }}
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
