<template>
  <div class="BasicInfo">
    <a-row>
      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="计划名称">计划名称</label>
        </span>
        <a-form-model-item prop="alias">
          <a-input v-model="_value.alias" class="input" />
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
          <label title="工作组">工作组</label>
        </span>
        <a-form-model-item prop="groupId">
          <!-- <a-select v-model="_value.groupId" class="input">
            <a-select-option
              v-for="{ label, value } in patrolGroupList"
              :key="value"
              :value="value"
            >{{ label }}</a-select-option>
          </a-select> -->
          <a-select placeholder="请选择工作组" v-model="_value.groupId" class="input" allowClear>
            <a-select-option v-for="item in patrolSourcelist" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="8" v-show="_value.groupId && _value.groupId.length > 0">
        <span class="ant-form-item-label">
          <label title="巡更路径">巡更路径</label>
        </span>
        <a-form-model-item prop="pathId">
          <a-select v-model="_value.pathId" class="input">
            <a-select-option v-for="{ label, value } in pathList" :key="value" :value="value">{{
              label
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="是否启用">是否启用</label>
        </span>
        <a-form-model-item prop="status">
          <a-select v-model="_value.status" class="input">
            <a-select-option v-for="{ value, label } in STATUS_LIST" :key="value">{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="">立即生效</label>
        </span>
        <a-form-model-item prop="status">
          <a-select v-model="_value.immediate" class="input">
            <a-select-option v-for="{ value, label } in IMMEDIATE_LIST" :key="value">{{ label }}</a-select-option>
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
  alias: [{ required: true, message: '请输入计划名称' }],
  groupId: [{ required: true, message: '请选择工作组' }],
  pathId: [{ required: true, message: '请选择路线' }],
  status: [{ required: true, message: '选择启用' }],
  immediate: [{ required: true, message: '选择立即生效' }]
}

export default {
  name: 'BasicInfo',
  mixins: [mixin, commonMixin],
  components: {},
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
    ],
    IMMEDIATE_LIST: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
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
        this.plan.pathId = ''
        parentId && (await this.fetchPathListList(parentId))
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
.input {
  min-width: 200px;
}
</style>
