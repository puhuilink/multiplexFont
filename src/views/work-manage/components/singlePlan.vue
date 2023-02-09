<template>
  <div class="border">
    <a-row type="flex" justify="center" align="center">
      <a-col :span="4">{{ source.label }}</a-col>
      <a-col :span="10">
        <a-icon type="schedule" style="color: green"></a-icon>当前值班人员: {{ source.currentCharger }} ({{ source.currentTime }})
      </a-col>
      <a-col :span="10">
        <a-icon type="schedule" style="color: red"></a-icon>下次值班人员: {{ source.nextCharger }} ({{ source.nextTime }})
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'SinglePlan',
  props: {
    source: {
      type: Object,
      default: () => ({
        label: '早班',
        currentCharger: 'xxx',
        currentTime: '从 2022-12-04 00:00:00 至 2022-12-05 08:00:00',
        nextCharger: 'xxx',
        nextTime: '从 2022-12-04 00:00:00 至 2022-12-05 08:00:00'
      })
    }
  }
}
</script>

<style scoped>
  .border {
    width: 95%;
    height: 40px;
    background-color: #F8F8F8;
    padding: 2px;
    border-radius: 10px;
  }
</style>
