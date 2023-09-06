<template>
  <a-modal
    centered
    :title="title"
    v-model="visible"
    :width="750"
    wrapClassName="TaskDetailSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
  >
    <a-row :gutter="8">
      <a-form-model
        ref="form"
        :model="formData"
        layout="inline"
      >
        <a-col :span="8">
          <a-form-model-item
            label="是否按照归属单位导出"
            prop="divOrg"
          >
            <a-switch v-model="formData.divOrg"></a-switch>
          </a-form-model-item>
        </a-col>

        <a-col :span="8" :offset="8">
          <a-form-model-item
            label="导出格式"
          >
            <a-checkbox
              :checked="formData.pdf"
              @change="(value) => checkStatus('pdf', value)"
            >pdf</a-checkbox>
            <a-checkbox
              :checked="formData.excel"
              @change="(value) => checkStatus('excel', value)"
            >excel</a-checkbox>
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-transfer
            :list-style="{
              width: '300px',
              height: '200px',
            }"
            :data-source="dataSource"
            :titles="['列表字段', '导出字段']"
            :target-keys="formData.fields"
            :selected-keys="selectedKeys"
            :render="item => item.title"
            @change="handleChange"
            @selectChange="handleSelectChange"
            class="transfer"
          />
        </a-col>
      </a-form-model>
    </a-row>
    <template #footer>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="onSubmit" :loading="loading" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import { SHIFT_SCHEMA_MAPPING } from '@/views/patrol/typing'
import { xungeng } from '@/utils/request'
import { downloadFile } from '@/utils/util'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'ExportSchema',
  mixins: [Schema],
  data () {
    return {
      formData: {
        divOrg: false, // 是否按照归属单位导出
        excel: false,
        pdf: true,
        fields: [],
        ids: []
      },
      selectedKeys: [],
      dataSource: [],
      loading: false
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      Promise.all(this.formData.ids.map(async el => {
        const data = await xungeng.request({
          url: '/export/taskHistoryZip',
          responseType: 'blob',
          data: { ..._.omit(this.formData, 'ids'), ids: [el] },
          method: 'post'
        }).catch((error) => {
          if (error.response) {
            console.log('error', error.response.status)
            switch (error.response.status) {
              case 501:
                this.$notification.error({
                  message: '系统提示',
                  description: '没有任务单号，请重试'
                })
                break
              case 502:
                this.$notification.error({
                  message: '系统提示',
                  description: '没有导出列'
                })
                break
              case 503:
                this.$notification.error({
                  message: '系统提示',
                  description: '未找到数据'
                })
                break
              case 504:
                this.$notification.error({
                  message: '系统提示',
                  description: '未知原因的导出失败'
                })
                break
              default:
                this.$notification.error({
                  message: '系统提示',
                  description: '导出参数有误，请重试'
                })
                break
            }
            this.loading = false
          }
        }).then(row => {
          if (row.type === 'application/octet-stream') {
            downloadFile('巡更报告-' + el + '-' + moment().format('YYYY-MM-DD HH:mm:ss'), row, { type: 'application/zip;charset=UTF-8' })
            this.$notification.success({
              message: '系统提示',
              description: '导出成功'
            })
          }
        })
      })).then((data) => {
        this.cancel()
      }).finally(el => {
        this.loading = false
      })
    },
    onShow (ids) {
      this.formData.ids = ids
      this.visible = true
      this.title = '导出'
      let index = 0
      SHIFT_SCHEMA_MAPPING.forEach((key, value) => {
        this.dataSource.push({
          key: value,
          title: key,
          order: index++
        })
      })
    },
    checkStatus (status, { target: { checked } }) {
      if (status === 'excel') {
        this.formData.excel = !!checked
      }
      if (status === 'pdf') {
        this.formData.pdf = true
      }
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.formData.fields = _.filter(this.dataSource, el => nextTargetKeys.includes(el.key)).map(el => el.key)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    }
  }
}
</script>

<style scoped>
.transfer {
  margin: 0 auto;
  width: 900px;
}
</style>
