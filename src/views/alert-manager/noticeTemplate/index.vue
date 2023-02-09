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
              v-model="form.message.customizeContent"
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
              v-model="form.claimed.customizeContent"
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
              v-model="form.recovery.customizeContent"
              :init-btn="form.initBtn"
              :disabled="disabled"
              ref="res"
              :mapping="TEMP_UNION_MAPPING"></TempEditor>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset:10 }">
            <a-button :loading="loading" type="primary" @click="mode === 'detail' ? changeStatus() : onSubmit()">
              {{ mode === 'detail' ? '编辑' : '保存' }}
            </a-button>
            <a-button style="margin-left: 10px;" :disabled="disabled" @click="initALL">
              一键恢复默认模板
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ALARMSTATUS, NOTICETYPE } from '@/tables/noticeTemp/enum'
import { TEMP_UNION_MAPPING } from '@/tables/alarm_temp/types'
import TempEditor from '@/components/Temp/PurposeTemp'
import { alarm } from '@/utils/request'
import _ from 'lodash'
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
        // 触发模板
        message: {
          id: '',
          type: '',
          customizeContent: '',
          defaultContent: ''
        },
        // 认领模板
        claimed: {
          id: '',
          type: '',
          customizeContent: '',
          defaultContent: ''
        },
        // 恢复模板
        recovery: {
          id: '',
          type: '',
          customizeContent: '',
          defaultContent: ''
        }
      },
      mode: 'detail',
      loading: false,
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
      // 切换重置按钮状态
      Object.assign(this.$data.form, this.$options.data.apply(this).form)
      this.mode = 'detail'
      this.disabled = true
      const a = await alarm.post('/api/configuration/template/list', { notifyWay: this.state })
      const list = _.get(a, 'data')
      for (const item of list) {
        if (item.alertStatusType === ALARMSTATUS.chufa) {
          // 触发模板
          this.form.message = item
          this.$refs.mes.setDefaultTemp(this.form.message.defaultContent)
        }
        if (item.alertStatusType === ALARMSTATUS.renling) {
          // 认领模板
          this.form.claimed = item
          this.$refs.cli.setDefaultTemp(this.form.claimed.defaultContent)
        }
        if (item.alertStatusType === ALARMSTATUS.huifu) {
          // 恢复模板
          this.form.recovery = item
          this.$refs.res.setDefaultTemp(this.form.recovery.defaultContent)
        }
      }
    },
    initALL () {
      this.$refs.res.toggleInit()
      this.$refs.cli.toggleInit()
      this.$refs.mes.toggleInit()
    },
    async onSubmit () {
      // TODO 提交模板
      try {
        this.loading = true
        const params = [_.pick(this.form.message, ['id', 'customizeContent']), _.pick(this.form.recovery, ['id', 'customizeContent']), _.pick(this.form.claimed, ['id', 'customizeContent'])]
        await alarm.post('/api/configuration/template/update', { templates: params.filter(el => el.id !== '') })
        this.$notification.success({
          message: '系统提示',
          description: '修改成功'
        })
        this.mode = 'detail'
        this.disabled = true
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
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
