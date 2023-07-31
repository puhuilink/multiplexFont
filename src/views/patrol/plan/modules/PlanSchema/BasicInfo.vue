<template>
  <div class="BasicInfo">

    <a-row>
      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="计划名称">计划名称</label>
        </span>
        <a-form-model-item prop="alias">
          <a-input v-model="_value.alias" style="width: 140px"/>
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="计划创建人">计划创建人</label>
          <span>{{ userInfo.staffName }}</span>
        </span>
      </a-col>

      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="巡更组">巡更组</label>
        </span>
        <a-form-model-item prop="groupId">
          <a-select v-model="_value.groupId" style="min-width: 120px">
            <a-select-option
              v-for="{ label, value } in patrolGroupList"
              :key="value"
              :value="value"
            >{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="8" v-show="_value.groupId && _value.groupId > 0">
        <span class="ant-form-item-label">
          <label title="巡更路径">巡更路径</label>
        </span>
        <a-form-model-item prop="pathId">
          <a-select v-model="_value.pathId" style="min-width: 140px">
            <a-select-option
              v-for="{ label, value } in pathList"
              :key="value"
              :value="value"
            >{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
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
  groupId: [
    { required: true, message: '请选择巡更组' }
  ],
  pathId: [
    { required: true, message: '请选择路线' }
  ],
  status: [
    { required: true, message: '选择启用' }
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
    },
    pathVisible () {
      return this.plan.groupId && this.plan.groupId.length > 0
    }
  },
  watch: {
    'plan.groupId': {
      immediate: true,
      deep: true,
      async handler (parentId) {
        await this.$nextTick()
        parentId && await this.fetchPathListList(parentId, this.plan.id)
      }
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
