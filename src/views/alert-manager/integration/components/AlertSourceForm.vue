<template>
  <div>
    <a-steps :current="current">
      <a-step :key="'form'" title="基本信息" />
      <a-step :key="'json'" title="json解析" />
      <a-step :key="'mapping'" title="关系映射" />
    </a-steps>
    <div class="steps-content">
      <a-form
        v-if="current === 0"
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
          :rules="[{ required: true, message: '请输入告警源名称！' }]"
          label="告警源名称"
          name="username"
        >
          <a-input :value="formState.name" style="width: 200px" />
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '请输入告警源IP！' }]"
          label="告警源IP"
          name="username"
        >
          <a-input :value="formState.ip" style="width: 200px" />
        </a-form-item>

        <a-form-item
          :rules="[{ required: true, message: '请输入告警源端口！' }]"
          label="告警源端口"
          name="port"
        >
          <a-input-number :value="formState.port" style="width: 200px" />
        </a-form-item>
        <a-form-item
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
          extra="规则说明：同一应用且EVENT_ID相同且级别相同；同一个告警源且告警名称相同级别相同的告警数据会被实时压缩成一条数据。最新的数据会覆盖历史数据，记录最新发生时间和发生频次。"
          label="开启自动去重"
          name="dedup"
        >
          <a-switch :checked="formState.dedup" @change="onDedupChange"/>
        </a-form-item>
        <a-form-item
          extra="当告警事件严重程度达到指定级别以后，需同时通知给相应领导，且值班人员需要对告警进行认领"
          label="开启认领"
          name="reclaim"
        >
          <a-switch :checked="formState.claim" @change="onReclaimChange"/>
        </a-form-item>
        <a-form-item
          extra="默认关闭，开启后需要配置监控时长，间隔时间内没有告警接入，将提醒选择的用户。时间范围：1~24小时，建议设置5小时以上更为合适"
          label="开启自监控"
          name="self"
        >
          <a-input v-show="formState.noneConfig.state" :value="formState.noneConfig.timeout" style="width: 200px">
            <template #suffix> 小时</template>
          </a-input>
          <a-switch :checked="formState.noneConfig.state" @change="onSelfChange"/>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '请输入告警源URL！' }]"
          label="告警URL"
          name="url"
        >
          <a-input :value="formState.url" style="width: 300px" />
        </a-form-item>
      </a-form>
      <div class="jsonContent" v-if="current === 1">
        <div class="originalJson">
          <h3>请输入JSON数据</h3>
          <textarea style="height: 400px;width: 60%" v-model="jsonContent"></textarea>
          <div>
            <a-button type="primary" @click="translateJson">解析</a-button>
          </div>
        </div>
        <div class="jsonResult">
          <h3>解析结果</h3>
          <textarea style="height: 400px;width: 60%" v-model="jsonResult" disabled></textarea>
        </div>
      </div>
      <div class="jsonMapping" v-if="current === 2">
        <a-form
          :label-col="{ span: 4 }"
          :model="mappingForm"
          :wrapper-col="{ span: 20 }"
          autocomplete="off"
          name="basic"
          style="margin-top: 30px"
        >
          <a-form-item
            v-for="(item,index) in Object.keys(mappingForm)"
            :label="mappingTitle[index]"
            :key="index"
          >
            <a-select :value="mappingForm[item]" style="width: 200px" />
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
        上一步
      </a-button>
      <a-button v-if="current < 2" type="primary" @click="next">
        下一步
      </a-button>
      <a-button
        v-if="current === 2"
        type="primary"
        @click="onSubmit"
      >
        提交
      </a-button>
    </div>
  </div>

</template>

<script>

import { addAlertSource } from '@/api/alertMockApi'

export default {
  name: 'AlertSourceForm',
  components: {},
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formState: {
        name: '',
        ip: '',
        port: 3000,
        autoClose: false,
        timeout: 0,
        claim: false,
        dedup: true,
        noneConfig: {
          state: false,
          timeout: 0
        },
        url: '',
        groupId: ''
      },
      current: 0,
      jsonContent: '',
      data: [],
      mappingForm: {
        id: '',
        level: '',
        content: '',
        title: '',
        target: '',
        happenedTime: '',
        alertSource: '',
        Key: ''
      },
      mappingTitle: [
        '告警ID',
        '告警级别',
        '告警内容',
        '告警标题',
        '告警对象',
        '发生时间',
        '告警源',
        'Key'
      ]
    }
  },
  methods: {
    translateJson () {
      if (!this.jsonContent.length) {
        this.$message.warn('请输入JSON数据！')
        return
      }
      let JsonBody
      try {
        JsonBody = JSON.parse(this.jsonContent)
      } catch (e) {
        this.$message.warn('输入的JSON数据有误！请检查后再试！')
      }
      console.log(JsonBody)
      this.data = Object.keys(JsonBody)
    },
    next () {
      this.current++
    },
    prev () {
      this.current--
    },
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
      this.formState.claim = flag
      // console.log('Failed:', flag)
    },
    onDedupChange (flag) {
      this.formState.dedup = flag
      // console.log('Failed:', flag)
    },
    onSelfChange (flag) {
      this.formState.noneConfig.state = flag
      // console.log('Failed:', flag)
    },
    onSubmit () {
      addAlertSource()
      console.log('')
    },
    initialData () {
      if (this.record !== {}) {
        this.formState = {
          name: this.record.sourceName ? this.record.sourceName : '',
          ip: this.record.sourceIp ? this.record.sourceIp : '',
          port: this.record.sourcePort ? this.record.sourcePort : 3000,
          autoClose: this.record.autoClose ? this.record.autoClose : false,
          timeout: 0,
          claim: false,
          dedup: true,
          noneConfig: {
            state: false,
            timeout: 0
          },
          url: '',
          groupId: ''
        }
      }
    }
  },
  computed: {
    jsonResult () {
      let content = ''
      this.data.forEach(element => {
        content += element + '\n'
      })
      return content
    }
  }
}
</script>

<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  padding-top: 80px;
}

.steps-action {
  margin-top: 24px;
}
.jsonContent{
  display: flex;
}
.originalJson{
  width: 45%;
  text-align: center;
}
.jsonResult{
  width: 45%;
  text-align: center;
}
</style>
