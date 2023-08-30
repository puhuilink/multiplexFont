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
            <a-switch v-model="formData.divId"></a-switch>
          </a-form-model-item>
        </a-col>

        <a-col :span="8" :offset="8">
          <a-form-model-item
            label="导出格式"
          >
            <a-checkbox
              :checked="formData.excel"
              @change="(value) => checkStatus('excel', value)"
            >excel</a-checkbox>
            <a-checkbox
              :checked="formData.pdf"
              @change="(value) => checkStatus('pdf', value)"
            >pdf</a-checkbox>
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

export default {
  name: 'ExportSchema',
  mixins: [Schema],
  data () {
    return {
      formData: {
        divOrg: false, // 是否按照归属单位导出
        excel: false,
        pdf: false,
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
      console.log('已提交', { ...this.formData })
      const data = await xungeng.request({
        url: '/export/taskHistoryZip/dasd',
        responseType: 'blob',
        data: this.formData,
        method: 'post'
      }).catch(function (error) {
        // TODO:根据错误码提示错误信息
        if (error.response) { console.log(error.response.status) }
      })
      this.loading = true
      if (data.type === 'application/json') {
        this.$notification.error({
          message: '系统提示',
          description: '导出参数有误，请重试'
        })
      } else {
        downloadFile('巡更记录单', data, { type: 'application/zip;charset=UTF-8' })
        this.$notification.success({
          message: '系统提示',
          description: '导出成功'
        })
        this.cancel()
      }
      this.loading = false
    },
    onShow (ids) {
      this.formData.ids = ids
      this.visible = true
      this.title = '导出'
      SHIFT_SCHEMA_MAPPING.forEach((key, value) => {
        this.dataSource.push({
          key: value,
          title: key
        })
      })
    },
    checkStatus (status, { target: { checked } }) {
      if (status === 'excel') {
        this.formData.excel = !!checked
      }
      if (status === 'pdf') {
        this.formData.pdf = !!checked
      }
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.formData.fields = nextTargetKeys
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
