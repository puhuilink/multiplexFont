<template>
  <div class="DevDebug">

    <!-- / 监控类型 -->
    <DeviceTypeListSelect
      v-model="model.deviceType"
    />

    <!-- / 品牌名称 -->
    <DeviceBrandListSelect
      :deviceType="model.deviceType"
      :value="model.deviceBrand"
      @input="deviceBrand => {
        model.deviceBrand = deviceBrand
        model.deviceModel = null
        model.hostId = []
      }"
    />

    <!-- / 品牌设备 -->
    <DeviceModelListSelect
      :deviceBrand="model.deviceBrand"
      :value="model.deviceModel"
      @input="deviceModel => {
        model.deviceModel = deviceModel
        model.hostId = []
      }"
    />

    <!-- / 设备名称 -->
    <HostListSelect
      :hostType="model.deviceModel"
      multiple
      v-model="model.hostId"
    />
  </div>
</template>

<script>
import DeviceBrandListSelect from './modules/DeviceBrandListSelect'
import DeviceTypeListSelect from './modules/DeviceTypeListSelect'
import DeviceModelListSelect from './modules/DeviceModelListSelect'
import HostListSelect from './modules/HostListSelect'
import AlarmRuleModel from './model'

export default {
  name: 'DevDebug',
  mixins: [],
  components: {
    DeviceBrandListSelect,
    DeviceTypeListSelect,
    DeviceModelListSelect,
    HostListSelect
  },
  props: {},
  data: () => ({
    model: new AlarmRuleModel()
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
