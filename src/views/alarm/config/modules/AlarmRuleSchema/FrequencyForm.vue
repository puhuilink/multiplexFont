<template>
  <fragment>
    <h3 class="title">告警频率</h3>
    <a-form-model-item
      v-bind="formItemLayout"
      label="告警产生后"
    >
      <a-input
        class="item1"
        v-model="settings.startTime"
      >
      </a-input>
      <span>小时内每</span>
      <a-input
        class="item1"
        v-model="settings.firstInterval"
      >
      </a-input>
      <span>分钟发送一次</span>
      <a-popover placement="rightBottom">
        <template slot="content">
          <p>为0则不限</p>
        </template>
        <template slot="title">
          <span>注意事项</span>
        </template>
        <a-icon
          type="info-circle"
          width="1em"
          height="1em"
          :spin="true"/>
      </a-popover>
    </a-form-model-item>
    <a-form-model-item
      v-bind="formItemLayout"
      :label="告警产生后"
      prop=""
      :rules="[{ required: true, message: useTime ? '请输入合并时间' : '请输入最大合并次数' }]"
    >
      <a-input
        class="item1"
        v-model="settings.startTime"
      >
      </a-input>
      <span>小时 - </span>
      <a-input
        class="item1"
        v-model="settings.endTime"
      >
      </a-input>
      <span>内每</span>
      <a-input
        class="item1"
        v-model="settings.secondInterval"
      >
      </a-input>
      <span>分钟发送一次</span>
    </a-form-model-item>
    <a-form-model-item
      v-bind="formItemLayout"
      label="告警产生后"
    >
      <a-input
        class="item1"
        v-model="settings.startTime"
      >
      </a-input>
      <span>小时后每</span>
      <a-input
        class="item1"
        v-model="settings.thirdInterval"
      >
      </a-input>
      <span>分钟发送一次</span>
      <a-popover placement="rightBottom">
        <template slot="content">
          <p>为0则不限</p>
        </template>
        <template slot="title">
          <span>注意事项</span>
        </template>
        <a-icon
          type="info-circle"
          width="1em"
          height="1em"
          :spin="true"/>
      </a-popover>
    </a-form-model-item>
  </fragment>
</template>

<script>
import Mixin from '@/views/alarm/config/modules/AlarmRuleSchema/Mixin'

export default {
  name: 'FrequencyForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({
    settings: {
      startTime: '',
      endTime: '',
      firstInterval: '',
      secondInterval: '',
      thirdInterval: ''
    }
  }),
  methods: {}
}
</script>

<style lang="less">

</style>
