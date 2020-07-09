<template>
  <div class="BasicInfo">

    <a-row>
      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="计划名称">计划名称</label>
        </span>
        <a-form-model-item prop="alias">
          <a-input v-model="_value.alias" />
        </a-form-model-item>
      </a-col>

      <a-col :span="5">
        <span class="ant-form-item-label">
          <label title="计划创建人">计划创建人</label>
          <span>{{ userInfo.staffName }}</span>
        </span>
      </a-col>

      <a-col :span="6">
        <span class="ant-form-item-label">
          <label title="巡更组">巡更组</label>
        </span>
        <a-form-model-item prop="group_id">
          <a-select v-model="_value.group_id" style="min-width: 140px">
            <a-select-option
              v-for="{ group_id, group_name } in patrolGroupList"
              :key="group_id"
              :value="group_id"
            >{{ group_name }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="5">
        <span class="ant-form-item-label">
          <label title="是否启用">是否启用</label>
        </span>
        <a-form-model-item prop="status">
          <a-select v-model="_value.status" style="min-width: 60px">
            <a-select-option v-for="{ value, label } in STATUS_LIST" :key="value">{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import mixin from './mixin'
import commonMixin from '../../commonMixin'

export const basicInfoRule = {
  alias: [
    { required: true, message: '请输入计划名称' }
  ],
  group_id: [
    { required: true, message: '请选择巡更组' }
  ]
}

export default {
  name: 'BasicInfo',
  mixins: [mixin, commonMixin],
  components: {},
  props: {},
  data: () => ({
    STATUS_LIST: [
      {
        value: 'enabled',
        label: '是'
      },
      {
        value: 'disabled',
        label: '否'
      }
    ]
  }),
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {},
  created () {
    this.fetchPatrolGroupList()
  }
}
</script>

<style lang="less">
// .BasicInfo {
// }
</style>
