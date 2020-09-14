<template>
  <div class="DataDomainSelect">
    <a-form-model-item label="告警级别" class="fw" v-bind="$props">
      <a-select
        class="fw"
      >
        <a-select-option
          v-for="level in [2, 3, 4, 5]"
          :key="level"
          :value="level"
        >{{ `L${level}` }}</a-select-option>
      </a-select>
    </a-form-model-item>
  </div>
</template>

<script>
export default {
  name: 'DataDomainSelect',
  mixins: [],
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
