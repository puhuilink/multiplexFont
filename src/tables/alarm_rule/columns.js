import Vue from 'vue'
import { AlarmRuleService } from '@/api'
import moment from 'moment'
import _ from 'lodash'
import { axios } from '@/utils/request'

export const ruleTypeMapping = new Map([
  ['merge', '告警合并'],
  ['upgrade', '告警升级'],
  ['recover', '告警消除'],
  ['forward', '告警通知']
])

export function enabledColumn () {
  // 使用闭包为每行记录维护各自状态
  const btnPropsList = Vue.observable([])

  const column = {
    title: '启用状态',
    dataIndex: 'enabled',
    width: 100,
    sorter: true,
    customRender (__, record, index) {
      {
        const { id, enabled } = record
        // TODO 启用权限位
        // const directives = [
        //   { name: 'v-action', value: 'M0304', modifiers: { abc: true } }
        // ]
        // {...{ directives }}

        // 默认配置
        if (!btnPropsList[index]) this.$set(btnPropsList, `${index}`, { loading: false })
        const btnProps = btnPropsList[index]

        return (
          <a-popconfirm
            title={`确定要${!enabled ? '启用' : '停用'}吗？`}
            okText="提交"
            cancelText="取消"
            onconfirm={async () => {
              try {
                btnProps.loading = true
                await AlarmRuleService.batchToggleEnabled([id], !enabled)
                record.enabled = enabled
                this.query(false)
              } catch (e) {
                this.$notifyError(e)
                throw e
              } finally {
                btnProps.loading = false
              }
            }}
          >
            <a-button { ...{ props: btnProps } } type={!enabled ? 'primary' : 'default'}>
              {!enabled ? '启用' : '停用'}
            </a-button>
          </a-popconfirm>
        )
      }
    }
  }

  // runtime
  column.customRender = column.customRender.bind(this)
  return column
}

export function unitEnabledColumn () {
  // 使用闭包为每行记录维护各自状态
  const btnPropsList = Vue.observable([])

  const column = {
    title: '启用状态',
    dataIndex: 'enabled',
    width: 100,
    sorter: true,
    customRender (__, record, index) {
      {
        const { enabled } = record
        // TODO 启用权限位
        // const directives = [
        //   { name: 'v-action', value: 'M0304', modifiers: { abc: true } }
        // ]
        // {...{ directives }}

        // 默认配置
        if (!btnPropsList[index]) this.$set(btnPropsList, `${index}`, { loading: false })
        const btnProps = btnPropsList[index]

        return (
          <a-popconfirm
            title={`确定要${!enabled ? '启用' : '停用'}吗？`}
            okText="提交"
            cancelText="取消"
            onconfirm={async () => {
              try {
                btnProps.loading = true
                const values = _.cloneDeep(record)
                values.enabled = !values.enabled
                values.lat = Number(values.lat)
                values.lng = Number(values.lng)
                await axios.post('/corp/update', values)
                record.enabled = enabled
                this.$notification.success({
                  message: '系统提示',
                  description: '操作成功'
                })
                this.query(false)
              } catch (e) {
                this.$notifyError(e)
                throw e
              } finally {
                btnProps.loading = false
              }
            }}
          >
            <a-button { ...{ props: btnProps } } type={!enabled ? 'primary' : 'default'}>
              {!enabled ? '启用' : '停用'}
            </a-button>
          </a-popconfirm>
        )
      }
    }
  }

  // runtime
  column.customRender = column.customRender.bind(this)
  return column
}

export function ruleTypeColumn () {
  return {
    title: '规则类型',
    dataIndex: 'rule_type',
    width: 100,
    sorter: true,
    customRender: ruleType => ruleTypeMapping.get(ruleType)
  }
}

export function createTimeColumn () {
  return {
    title: '更新时间',
    dataIndex: 'create_ime',
    width: 200,
    sorter: true,
    orderBy: 'descend',
    customRender: time => time ? moment(time).format() : ''
  }
}

export function updateColumn () {
  return {
    title: '更新时间',
    dataIndex: 'update_time',
    width: 200,
    sorter: true,
    customRender: time => time ? moment(time).format() : ''
  }
}

export function titleColumn () {
  return {
    title: '规则名称',
    dataIndex: 'title',
    width: 300,
    fixed: 'left'
  }
}

export function deviceBrandColumn () {
  const column = {
    title: '品牌名称',
    dataIndex: 'device_brand dictBrand { value_label }',
    width: 200,
    customRender: (__, { device_brand, dictBrand }) => _.get(dictBrand, 'value_label') || device_brand
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function modelDeviceBrandColumn () {
  const column = {
    title: '品牌名称',
    dataIndex: 'model { brand_name }',
    width: 200,
    customRender: (__, { model }) => _.get(model, 'brand_name')
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function deviceTypeColumn () {
  const column = {
    title: '监控类型',
    dataIndex: 'device_type dictType { value_label }',
    width: 200,
    customRender: (__, { device_type, dictType }) => _.get(dictType, 'value_label') || device_type
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function hostModelType () {
  const column = {
    title: '品牌设备',
    dataIndex: 'model { device_model_name }',
    width: 200,
    customRender: (__, { model }) => _.get(model, 'device_model_name')
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function modelTypeColumn () {
  const column = {
    title: '监控类型',
    dataIndex: 'model { deviceLabel { value_label } }',
    width: 200,
    customRender: (__, { model: { deviceLabel } }) => {
      return deviceLabel ? _.get(deviceLabel, 'value_label') : ''
    }
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function deviceModelColumn () {
  const column = {
    title: '品牌设备',
    dataIndex: 'device_model dictModel { value_label }',
    width: 200,
    customRender: (__, { device_model, dictModel, model }) => _.get(dictModel, 'value_label') || device_model
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function metricModelIdColumn () {
  const column = {
    title: '检查项',
    dataIndex: 'metric_model_id modelMetric { alias }',
    width: 200,
    customRender: (metricModelId, { modelMetric }) => _.get(modelMetric, 'alias') || metricModelId
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function metricModelColumn () {
  const column = {
    title: '检查项',
    dataIndex: 'modelMetric { alias }',
    width: 200,
    customRender: (__, { modelMetric }) => _.get(modelMetric, 'alias')
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function endpointModelIdColumn () {
  const column = {
    title: '检查实体',
    dataIndex: 'endpoint_model_id modelEndpoint { alias }',
    width: 200,
    customRender: (endpointModelId, { modelEndpoint }, model) => _.get(modelEndpoint, 'alias') || endpointModelId
  }

  column.customRender = column.customRender.bind(this)
  return column
}

export function modelEndpointModelIdColumn () {
  const column = {
    title: '检查实体',
    dataIndex: 'model { endpoint_alias }',
    width: 200,
    customRender: (__, { model }) => _.get(model, 'endpoint_alias')
  }

  column.customRender = column.customRender.bind(this)
  return column
}
