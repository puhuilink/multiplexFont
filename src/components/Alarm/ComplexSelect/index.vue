<template>
  <div>

    <div class="ComplexSelect">
      <div
        v-show="advanced"
        class="ComplexSelect__mask"
        @click="onShowAdvancedSelect"
      ></div>
      <a-select class="ComplexSelect__select"></a-select>
      <a-button
        type="link"
        @click="onToggleAdvanced"
      >{{ advanced ? '快速搜索' : '高级分类' }}</a-button>
    </div>

    <a-modal
      :afterClose="() => cache = null"
      title="选择监控对象"
      v-model="visible"
      :width="1024"
      wrapClassName="ComplexSelect__modal"
      @cancel="onCancel"
      @ok="onOk"
    >
      <DeviceTypeListSelect
        :value="model.deviceType"
        @input="deviceType => {
          Object.assign(model, {
            deviceType,
            deviceBrand: null,
            deviceModel: null,
            hostId: []
          })
        }"
      />

      <DeviceBrandListSelect
        :deviceType="model.deviceType"
        :value="model.deviceBrand"
        @input="deviceBrand => {
          Object.assign(model, {
            deviceBrand,
            deviceModel: null,
            hostId: []
          })
        }"
      />

      <DeviceModelListSelect
        :deviceBrand="model.deviceBrand"
        :value="model.deviceModel"
        @input="deviceModel => {
          Object.assign(model, {
            deviceModel,
            hostId: []
          })
        }"
      />

      <HostListSelect
        :hostType="model.deviceModel"
        multiple
        v-model="model.hostId"
      />
    </a-modal>

  </div>
</template>

<script>
import DeviceBrandListSelect from './modules/DeviceBrandListSelect'
import DeviceTypeListSelect from './modules/DeviceTypeListSelect'
import DeviceModelListSelect from './modules/DeviceModelListSelect'
import HostListSelect from './modules/HostListSelect'
import AlarmRuleModel from '../AlarmRuleModel'
import _ from 'lodash'

export default {
  name: 'ComplexSelect',
  mixins: [],
  components: {
    DeviceBrandListSelect,
    DeviceTypeListSelect,
    DeviceModelListSelect,
    HostListSelect
  },
  props: {
    value: {
      type: Object,
      default: () => new AlarmRuleModel(),
      required: true
    }
  },
  data: () => ({
    advanced: false,
    cache: null,
    visible: false
  }),
  computed: {
    model: {
      get () {
        return this.value
      },
      set (model) {
        this.$emit('input', model)
      }
    }
  },
  methods: {
    onCancel () {
      if (this.cache) {
        Object.assign(this.model, this.cache)
      }
      this.visible = false
    },
    onOk () {
      this.visible = false
    },
    onShowAdvancedSelect () {
      this.visible = true
      this.cache = _.cloneDeep(this.model)
    },
    onToggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less">
.ComplexSelect {

  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  &__select {
    width: 360px !important;
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 360px;
    height: 32px;
  }
}
</style>
