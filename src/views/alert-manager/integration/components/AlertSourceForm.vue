<template>
  <a-form
    :label-col="{ span: 4 }"
    :model="formState"
    :wrapper-col="{ span: 20 }"
    autocomplete="off"
    name="basic"
    style="margin-top: 30px"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      :rules="[{ required: true, message: 'Please input your username!' }]"
      label="告警源名称"
      name="username"
    >
      <a-input :value="formState.name" style="width: 200px" />
    </a-form-item>
    <a-form-item
      :rules="[{ required: true, message: 'Please input your username!' }]"
      label="告警源IP"
      name="username"
    >
      <a-input :value="formState.ip" style="width: 200px" />
    </a-form-item>

    <a-form-item
      :rules="[{ required: true, message: 'Please input your password!' }]"
      label="告警源端口"
      name="password"
    >
      <a-input-number :value="formState.port" style="width: 200px" />
    </a-form-item>
    <a-form-item
      :rules="[{ required: true, message: 'Please input your password!' }]"
      extra="针对未关闭的告警，以监控工具最后一次发出告警事件为准，如果设定的时间内未进行手动关闭告警，系统将自动为您关闭告警；自定义区间范围：0-1440分钟，0表示永不关闭，1440分钟即为24小时。"
      label="自动关闭时间"
      name="password"
    >
      <a-input v-show="formState.autoClose" :value="formState.timeout" style="width: 200px">
        <template #suffix> 分钟</template>
      </a-input>
      <a-switch :checked="formState.autoClose" @change="onAutoCloseChange"/>
    </a-form-item>
    <a-form-item
      :rules="[{ required: true, message: 'Please input your password!' }]"
      extra="规则说明：同一应用且EVENT_ID相同且级别相同；同一个告警源且告警名称相同级别相同的告警数据会被实时压缩成一条数据。最新的数据会覆盖历史数据，记录最新发生时间和发生频次。"
      label="开启自动去重"
      name="password"
    >
      <a-switch :checked="formState.dedup" @change='onDedupChange'/>
    </a-form-item>
    <a-form-item
      :rules="[{ required: true, message: 'Please input your password!' }]"
      extra="当告警事件严重程度达到指定级别以后，需同时通知给相应领导，且值班人员需要对告警进行认领"
      label="开启认领"
      name="password"
    >
      <a-switch :checked="formState.reclaim" @change='onReclaimChange'/>
    </a-form-item>
    <a-form-item
      :rules="[{ required: true, message: 'Please input your password!' }]"
      extra="默认关闭，开启后需要配置监控时长，间隔时间内没有告警接入，将提醒选择的用户。时间范围：1~24小时，建议设置5小时以上更为合适"
      label="开启自监控"
      name="password"
    >
      <a-input v-show="formState.noneConfig.state" :value="formState.noneConfig.timeout" style="width: 200px">
        <template #suffix> 小时</template>
      </a-input>
      <a-switch :checked="formState.noneConfig.state" @change='onSelfChange'/>
    </a-form-item>
    <a-form-item
      :rules="[{ required: true, message: 'Please input your password!' }]"
      label="告警URL"
      name="password"
    >
      <a-input :value="formState.url" style="width: 300px" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
      <a-button html-type="submit" type="primary">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<script>

export default {
  name: 'AlertSourceForm',
  components: {},
  props: {},
  data () {
    return {
      formState: {
        name: '',
        ip: '',
        port: 3000,
        autoClose: false,
        timeout: 0,
        reclaim: false,
        dedup: true,
        noneConfig: {
          state: false,
          timeout: 0
        },
        url: '',
        groupId: ''
      }
    }
  },
  methods: {
    onFinish (values) {
      console.log('Success:', values)
    },

    onFinishFailed (errorInfo) {
      console.log('Failed:', errorInfo)
    },
    onAutoCloseChange (flag) {
      this.formState.autoClose = flag
      // console.log('Failed:', flag)
    },
    onReclaimChange (flag) {
      this.formState.reclaim = flag
      // console.log('Failed:', flag)
    },
    onDedupChange (flag) {
      this.formState.dedup = flag
      // console.log('Failed:', flag)
    },
    onSelfChange (flag) {
      this.formState.noneConfig.state = flag
      // console.log('Failed:', flag)
    }
  }
}
</script>

<style scoped></style>
