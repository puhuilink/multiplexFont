/**
* 告警类型选择
* Author: dong xing
* Date: 2020/4/8
* Time: 17:26
* Email: dong.xing@outlook.com
*/

<template>
  <div class="alarm-type-select">
    <a-select
      allowClear
      mode="multiple"
      :maxTagCount="2"
      style="min-width: 200px"
      v-model="form.alarmType"
      placeholder="请选择告警类型"
    >
      <a-select-opt-group
        v-for="(group,index) in alertList"
        :key="index"
        :label="group[0].parentname_s"
        :allowClear="true"
      >
        <template v-for="groupitem in group">
          <a-select-option :value="groupitem.id_s" :key="groupitem.id_s">{{ groupitem.label_s }}</a-select-option>
        </template>
      </a-select-opt-group>
    </a-select>
  </div>
</template>

<script>
import queryList from '@/api/controller/AlarmqQueryList'

export default {
  name: 'AlarmTypeSelect',
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    alertList: [],
    loading: false
  }),
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        this.alertList = await queryList.alertList()
      } catch (e) {
        this.alertList = []
        throw e
      } finally {
        this.loading = false
      }
    },
    select () {
      this.$emit('update:alarmType', this.form.alarmType)
    }
  }
}
</script>

<style scoped>

</style>
