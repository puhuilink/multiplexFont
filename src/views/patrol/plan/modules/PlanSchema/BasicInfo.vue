<template>
  <div class="BasicInfo">

    <a-row>
      <a-col :span="8">
        <span class="ant-form-item-label">
          <label title="计划名称">计划名称</label>
        </span>
        <a-form-model-item>
          <a-input v-model="value.alias" />
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
        <a-form-model-item>
          <a-select v-model="value.group" style="min-width: 140px">
            <a-select-option v-for="{ value, label } in groupList" :key="value">{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="5">
        <span class="ant-form-item-label">
          <label title="是否启用">是否启用</label>
        </span>
        <a-form-model-item>
          <a-select v-model="value.status" style="min-width: 60px">
            <a-select-option v-for="{ value, label } in STATUS_LIST" :key="value">{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'BasicInfo',
  mixins: [mixin],
  components: {},
  props: {},
  data: () => ({
    // TODO
    groupList: [
      {
        value: 'enabled',
        label: '厦门动环巡更组'
      }
    ],
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
  methods: {}
}
</script>

<style lang="less">
.BasicInfo {
}
</style>
