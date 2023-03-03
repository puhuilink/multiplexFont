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
          <a-input v-model="formState.name" style="width: 200px" />
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '请输入告警源IP！' }]"
          label="告警源IP"
          name="username"
        >
          <a-input v-model="formState.ip" style="width: 200px" />
        </a-form-item>

        <a-form-item
          :rules="[{ required: true, message: '请输入告警源端口！' }]"
          label="告警源端口"
          name="port"
        >
          <a-input-number v-model="formState.port" style="width: 200px" />
        </a-form-item>
        <a-form-item
          extra="针对未关闭的告警，以监控工具最后一次发出告警事件为准，如果设定的时间内未进行手动关闭告警，系统将自动为您关闭告警；自定义区间范围：0-1440分钟，0表示永不关闭，1440分钟即为24小时。"
          label="自动关闭"
          name="password"
        >
          <a-input-number v-show="formState.autoClose" v-model="formState.autoCloseInterval" style="width: 100px">
          </a-input-number>
          <span v-show="formState.autoClose">分钟后自动关闭</span>
          <a-switch :checked="formState.autoClose" @change="onAutoCloseChange"/>
        </a-form-item>
        <a-form-item
          extra="规则说明：同一应用且EVENT_ID相同且级别相同；同一个告警源且告警名称相同级别相同的告警数据会被实时压缩成一条数据。最新的数据会覆盖历史数据，记录最新发生时间和发生频次。"
          label="开启自动去重"
          name="dedup"
        >
          <a-switch :checked="formState.autoGroup" @change="onDedupChange"/>
        </a-form-item>
        <a-form-item
          extra="当告警事件严重程度达到指定级别以后，需同时通知给相应领导，且值班人员需要对告警进行认领"
          label="开启认领"
          name="reclaim"
        >
          <a-select v-show="formState.claim" v-model="formState.claimLevel" style="width: 200px" :options="options">
          </a-select>
          <a-switch :checked="formState.claim" @change="onReclaimChange"/>
        </a-form-item>
        <a-form-item
          extra="默认关闭，开启后需要配置监控时长，间隔时间内没有告警接入，将提醒选择的用户。时间范围：1~24小时，建议设置5小时以上更为合适"
          label="开启自监控"
          name="self"
        >
          <a-input-number v-show="formState.monitor" v-model="formState.monitorInterval" style="width: 180px">
          </a-input-number>
          <span v-show="formState.monitor">小时</span>
          <a-switch :checked="formState.monitor" @change="onSelfChange"/>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '请输入告警源URL！' }]"
          label="告警URL"
          name="url"
        >
          <a-input v-model="formState.url" style="width: 300px" />
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
            <a-select v-model="mappingForm[item]" style="width: 200px" :options="jsonOptions"/>
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

import { alarm } from '@/utils/request'

const typeObj = {
  'uniqueKey': 'string',
  'device': 'string',
  'title': 'string',
  'content': 'string',
  'level': 'string',
  'startTime': 'struct',
  'lastTime': 'struct',
  'deviceType': 'string'
}
export default {
  name: 'AlertSourceForm',
  components: {},
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    platformId: {
      type: String,
      default: '302455444528566272'
    }
  },
  data () {
    return {
      formState: {
        name: '',
        ip: '',
        port: 3000,
        autoClose: false,
        autoCloseInterval: 0,
        claim: false,
        claimLevel: '',
        autoGroup: true,
        monitor: false,
        monitorInterval: 0,
        url: ''
      },
      current: 0,
      jsonContent: '',
      data: [],
      jsonOptions: [],
      options: [
        {
          value: '1',
          label: 'p1'
        },
        {
          value: '2',
          label: 'p2'
        },
        {
          value: '3',
          label: 'p3'
        },
        {
          value: '4',
          label: 'p4'
        },
        {
          value: '5',
          label: 'p5'
        }
      ],
      mappingForm: {
        uniqueKey: '',
        level: '',
        content: '',
        title: '',
        device: '',
        startTime: '',
        lastTime: '',
        deviceType: ''
      },
      jb: null,
      mappingTitle: [
        'uniqueKey',
        'level',
        'content',
        'title',
        'device',
        'startTime',
        'lastTime',
        'deviceType'
      ]
    }
  },
  methods: {
    translateJson () {
      if (!this.jsonContent.length) {
        this.$message.warn('请输入JSON数据！')
        return
      }
      let JsonBody = null
      try {
        JsonBody = JSON.parse(this.jsonContent)
      } catch (e) {
        this.$message.warn('输入的JSON数据有误！请检查后再试！')
      }
      this.jb = JsonBody
      this.data = Object.keys(JsonBody)
      this.jsonOptions = []
      this.data.forEach(j => {
        this.jsonOptions.push({
          value: j,
          label: j
        })
      })
    },
    next () {
      const judgeColumns = ['name', 'ip', 'port', 'url']
      let isEmpty = false
      judgeColumns.forEach(c => {
        if (this.formState[c] === null || this.formState[c] === undefined || this.formState[c] === '') {
          isEmpty = true
        }
      })
      if (this.current === 0 && isEmpty) {
        this.$message.warn('有输入项未填！请检查您的操作是否有误！')
        return
      }
      if (this.current === 1 && this.data.length < 1) {
        this.$message.warn('解析结果为空！请检查您的操作是否有误！')
        return
      }
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
      this.formState.autoGroup = flag
      // console.log('Failed:', flag)
    },
    onSelfChange (flag) {
      this.formState.monitor = flag
      // console.log('Failed:', flag)
    },
    async onSubmit () {
      const uk = this.mappingForm.uniqueKey
      if (uk === null || uk === '') {
        this.$message.warn('唯一标识符必须匹配！')
        return
      }
      const alertMapping = []
      Object.keys(this.mappingForm).forEach(m => {
        if (this.mappingForm[m] && this.mappingForm[m] !== '') {
          if (m === 'uniqueKey') {
            alertMapping.push({
              'sourceField': this.mappingForm[m],
              'targetField': m,
              'targetType': typeObj[m],
              remark: this.jb[this.mappingForm[m]]
            })
          } else {
            alertMapping.push({
              'sourceField': this.mappingForm[m],
              'targetField': m,
              'targetType': typeObj[m]
            })
          }
        }
      })
      this.formState.port = this.formState.port.toString()
      if (this.formState.monitor) {
        this.formState.monitorInterval = this.formState.monitorInterval.toString()
      } else {
        delete this.formState.monitorInterval
      }
      if (this.formState.autoClose) {
        this.formState.autoCloseInterval = this.formState.autoCloseInterval.toString()
      } else {
        delete this.formState.autoCloseInterval
      }
      const sourceData = { ...this.formState, platformId: this.platformId }
      let requestAddress = '/api/integration/source/add'
      if (this.record && this.record !== {}) {
        requestAddress = '/api/integration/source/update'
      }
      try {
        const res = await alarm.post(requestAddress, { sourceData, alertMapping })
        if (res.code === 200) {
          this.$message.success(res.msg)
          await this.$router.push('platform')
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.$message.error(e.response.data.msg)
      }
    },
    initialData () {
      if (this.record && this.record !== {}) {
        this.formState = { ...this.record }
      }
      console.log(this.formState)
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
  },
  mounted () {
    this.initialData()
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
