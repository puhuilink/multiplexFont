<template>
  <div>

    <div class="ComplexSelect">
      <div
        v-show="advanced"
        class="ComplexSelect__mask"
        @click="onShowAdvancedSelect"
      ></div>
      <a-select
        v-bind="ctx.editAbleProps"
        class="ComplexSelect__select"
        mode="multiple"
        :notFoundContent="fetching ? '加载中' : '暂无数据'"
        placeholder="请输入IP地址、序列号、资产设备标签精准搜索"
        @search="onSearch"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="d in dataList" :key="d.value">
          {{ d.text }}
        </a-select-option>
      </a-select>
      <a-button
        type="link"
        :disabled="disabled"
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
      <DeviceTypeSelect
        v-bind="ctx.editAbleProps"
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

      <DeviceBrandSelect
        v-bind="ctx.editAbleProps"
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

      <DeviceModelSelect
        v-bind="ctx.editAbleProps"
        :deviceBrand="model.deviceBrand"
        :value="model.deviceModel"
        @input="deviceModel => {
          Object.assign(model, {
            deviceModel,
            hostId: []
          })
        }"
      />

      <CmdbHostSelect
        v-bind="ctx.editAbleProps"
        :hostTypeDictValueCode="model.deviceModel"
        multiple
        v-model="model.hostId"
      />
    </a-modal>

  </div>
</template>

<script>
import DeviceBrandSelect from './modules/DeviceBrandSelect'
import DeviceTypeSelect from './modules/DeviceTypeSelect'
import DeviceModelSelect from './modules/DeviceModelSelect'
import CmdbHostSelect from './modules/CmdbHostSelect'
import AlarmRuleModel from '../AlarmRuleModel'
import _ from 'lodash'

export default {
  name: 'ComplexSelect',
  mixins: [],
  inject: {
    ctx: {
      default: () => ({})
    }
  },
  components: {
    DeviceBrandSelect,
    DeviceTypeSelect,
    DeviceModelSelect,
    CmdbHostSelect
  },
  props: {
    value: {
      type: Object,
      default: () => new AlarmRuleModel()
      // required: true
    }
  },
  data: () => ({
    advanced: false,
    cache: null,
    dataList: [],
    fetching: false,
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
    },
    disabled () {
      return _.get(this, 'ctx.editAbleProps.disabled')
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
    onSearch: _.debounce(async function (e) {
      try {
        this.fetching = true
        this.dataList = []
      } catch (e) {
        this.dataList = []
        throw e
      } finally {
        this.fetching = false
      }
    }, 200),
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
