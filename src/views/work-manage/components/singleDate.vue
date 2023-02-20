<template>
  <div>
    从<a-time-picker :default-open-value="moment('00:00', 'HH:mm')"></a-time-picker>到<a-time-picker :default-open-value="moment('00:00', 'HH:mm')"></a-time-picker>
    <a-select placeholder="请选择值班人" style="width: 30%"><a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
      {{ (i + 9).toString(36) + i }}
    </a-select-option></a-select> <a-divider type="vertical"/><a-icon type="plus"/>
  </div>
</template>

<script>
export default {
  name: 'SingleDate'
}
</script>

<style scoped>

</style>
