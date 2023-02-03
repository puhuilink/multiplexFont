<template>
  <div class="form">
    <a-row type="flex" justify="space-between" align="top">
      <a-col :span="24">
        <div style="width: 100%">
          <a-tabs :activeKey="state" @change="onChangeState">
            <a-tab-pane :key="NOTICETYPE.tele" tab="短信"></a-tab-pane>
            <a-tab-pane :key="NOTICETYPE.jjt" tab="交建通"></a-tab-pane>
            <a-tab-pane :key="NOTICETYPE.mail" tab="邮箱"></a-tab-pane>
            <a-tab-pane :key="NOTICETYPE.gongdan" tab="工单"></a-tab-pane>
          </a-tabs>
        </div>
        <a-form-model :rules="rules" :model="form" @submit="onSubmit" layout="vertical">
          <a-form-model-item prop="message">
            <span slot="label">
              <a-tooltip title="通知模板">
                <a-icon type="mail" />
              </a-tooltip>
              触发通知模版
            </span>
            <TempEditor
              v-model="form.message"
              :init-btn="form.initBtn"
              :disabled="disabled"
              ref="mes"
              :mapping="TEMP_UNION_MAPPING"></TempEditor>
          </a-form-model-item>
          <a-form-model-item prop="claimed">
            <span slot="label">
              <a-tooltip title="通知模板">
                <a-icon type="mail" />
              </a-tooltip>
              认领通知模版
            </span>
            <TempEditor
              v-model="form.claimed"
              :init-btn="form.initBtn"
              :disabled="disabled"
              ref="cli"
              :mapping="TEMP_UNION_MAPPING"></TempEditor>
          </a-form-model-item>
          <a-form-model-item prop="recovery">
            <span slot="label">
              <a-tooltip title="通知模板">
                <a-icon type="mail" />
              </a-tooltip>
              恢复通知模版
            </span>
            <TempEditor
              v-model="form.recovery"
              :init-btn="form.initBtn"
              :disabled="disabled"
              ref="res"
              :mapping="TEMP_UNION_MAPPING"></TempEditor>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset:10 }">
            <a-button type="primary" @click="mode === 'detail' ? changeStatus() : onSubmit()">
              {{ mode === 'detail' ? '编辑' : '保存' }}
            </a-button>
            <a-button style="margin-left: 10px;" :disabled="disabled" @click="initALL">
              一键恢复默认设置
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { NOTICETYPE } from '@/tables/noticeTemp/enum'
import { TEMP_UNION_MAPPING } from '@/tables/alarm_temp/types'
import TempEditor from '@/components/Temp/PurposeTemp'
import { alarm } from '@/utils/request'
const columns = [{
  title: '标签名',
  dataIndex: 'label'
}, {
  title: '说明',
  dataIndex: 'desc'
}]
const data = [
  {
    key: '1',
    label: 'alarmId',
    desc: '告警编号'
  },
  {
    key: '2',
    label: 'alarmName',
    desc: '告警名称'

  }
]
const rules = {
  message: [
    {
      required: true, message: '输入', trigger: 'blur'
    }
  ],
  claimed: [
    {
      required: true, message: '输入', trigger: 'blur'
    }
  ],
  recovery: [
    {
      required: true, message: '输入', trigger: 'blur'
    }
  ]
}
const args = '@{members}于@{ackTime}认领@{LEVEL}级别告警，告警对象:@{object}, 告警编号@{alarmId}，主机：@{object}，告警发生时间：@{closeTime}，告警标题：@{name}告警内容：@{content}'
export default {
  name: 'Index',
  data () {
    return {
      NOTICETYPE,
      TEMP_UNION_MAPPING,
      columns,
      data,
      rules,
      state: NOTICETYPE.tele,
      form: {
        initBtn: true,
        message: '',
        claimed: '',
        recovery: ''
      },
      mode: 'detail',
      disabled: true,
      args
    }
  },
  components: {
    TempEditor
  },
  methods: {
    onChangeState (key) {
      // TODO 切换不同的模板触发器
      this.state = key
      this.fetch()
    },
    async fetch () {
      const a = await alarm.post('/api/configuration/template/list', { notifyWay: this.state })
      console.log('fetch', a)
      a.map()
    },
    initALL () {
      this.$refs.res.toggleInit()
      this.$refs.cli.toggleInit()
      this.$refs.mes.toggleInit()
    },
    onSubmit () {
      // TODO 提交模板
      console.log('提交', this.form)
    },
    changeStatus () {
      this.mode = 'edit'
      this.disabled = false
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="less" scoped>
.labelList {
  width: 100%;
  background: #fff;
  &_table {
    margin: 0 auto;
  }
}
</style>
