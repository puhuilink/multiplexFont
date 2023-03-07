<template>
  <div class="border">
    <a-row type="flex" justify="center">
      <a-col :span="2">排班名称:
        <a-tooltip>
          <template slot="title">{{ source.label }}</template>
          {{ source.label }}
        </a-tooltip>
      </a-col>
      <a-col :span="8">
        <a-icon type="schedule" style="color: green"></a-icon>当前值班人员:
        <a-tooltip>
          <template #title>{{ source.currentCharger }}</template>
          {{ source.currentCharger }}
        </a-tooltip>
        <a-tooltip>
          <template slot="title">({{ source.currentTime }})</template>
          ({{ source.currentTime }})
        </a-tooltip>
      </a-col>
      <a-col :span="10">
        <a-icon type="schedule" style="color: red"></a-icon>下次值班人员:
        <a-tooltip>
          <template #title>{{ source.nextCharger }}</template>
          {{ source.nextCharger }}
        </a-tooltip>
        <a-tooltip>
          <template slot="title">({{ source.nextTime }})</template>
          ({{ source.nextTime }})
        </a-tooltip>
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
    height: 60px;
    line-height: 60px;
    background-color: #F8F8F8;
    padding: 2px;
    border-radius: 10px;
    margin: 0 auto;
    color: 	#000;
    font-size: 16px;
  }
</style>
