import {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER,
  FORWARD_MODEL_EMAIL,
  FORWARD_MODEL_SMS
} from '../../typing'
import _ from 'lodash'

export {
  FORWARD_MODEL_EMAIL,
  FORWARD_MODEL_SMS
}

export const CONTENT_TYPE_COUNT = 'count'
export const CONTENT_TYPE_TIME = 'time'
export {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER
}

export class SendModel {
  constructor ({
    id,
    host_id,
    endpoint_id,
    metric_id,
    event_level,
    send_type = '',
    contact = '',
    temp_sms_id,
    temp_email_id
  } = {}) {
    this.id = id
    this.host_id = host_id
    this.endpoint_id = endpoint_id
    this.metric_id = metric_id
    this.event_level = event_level
    this.send_type = send_type.split('/').filter(Boolean)
    this.contact = contact.split('/').filter(Boolean)
    this.temp_sms_id = temp_sms_id
    this.temp_email_id = temp_email_id
  }

  toggleEmail () {
    const index = this.send_type.indexOf(FORWARD_MODEL_EMAIL)
    if (index === -1) {
      this.send_type.push(FORWARD_MODEL_EMAIL)
    } else {
      this.send_type.splice(index, 1)
    }
  }

  toggleSMS () {
    const index = this.send_type.indexOf(FORWARD_MODEL_SMS)
    if (index === -1) {
      this.send_type.push(FORWARD_MODEL_SMS)
    } else {
      this.send_type.splice(index, 1)
    }
  }

  get hasEnabledEmail () {
    return this.send_type.includes(FORWARD_MODEL_EMAIL)
  }

  get hasEnabledSMS () {
    return this.send_type.includes(FORWARD_MODEL_SMS)
  }

  // 仅写入数据库时用到
  get temp_id () {
    const tempIdList = []
    const { send_type, temp_sms_id, temp_email_id } = this

    send_type.includes(FORWARD_MODEL_EMAIL) && tempIdList.push(temp_email_id)
    send_type.includes(FORWARD_MODEL_SMS) && tempIdList.push(temp_sms_id)

    return tempIdList
      .filter(Boolean)
      .join('/')
  }

  serialize () {
    const { contact, send_type, temp_id, ...rest } = this
    return {
      contact: contact.filter(Boolean).join('/'),
      send_type: send_type.filter(Boolean).join('/'),
      temp_id,
      ...rest
    }
  }
}

class BasicRuleModel {
  constructor ({
    id,
    title,
    host_id,
    endpoint_id,
    metric_id,
    rule_type,
    enabled
  } = {}) {
    this.id = id
    this.title = title
    this.host_id = host_id
    this.endpoint_id = endpoint_id
    this.metric_id = metric_id
    this.rule_type = rule_type
    // https://github.com/vueComponent/ant-design-vue/issues/971
    this.enabled = ~~enabled
  }

  serialize () {
    const { enabled, ...rest } = this
    return _.toPlainObject({
      ...rest,
      enabled: !!enabled
    })
  }
}

class ContentRuleModel extends BasicRuleModel {
  constructor ({ content = '{}', ...rest }) {
    super(rest)
    this.content = _.pick(JSON.parse(content), ['type', 'number'])
  }

  // https://github.com/vueComponent/ant-design-vue/blob/master/components/form-model/FormItem.jsx#L143
  // antd form-model 缺陷，无法访问到深层次的值，此处将深层次值展开到第一层，以便进行修改与校验，下同
  get number () {
    return this.content.number
  }

  set number (number) {
    this.content.number = number
  }

  get type () {
    return this.content.type
  }

  set type (type) {
    this.content.type = type
  }

  serialize () {
    const { enabled, content, ...rest } = this
    return _.toPlainObject({
      ...rest,
      enabled: !!enabled,
      content: JSON.stringify(content)
    })
  }
}

/**
 * 合并规则
 */
class MergeRuleModel extends ContentRuleModel {
  constructor (props = {}) {
    super(props)
    this.rule_type = ALARM_RULE_MERGE
  }
}

/**
 * 升级规则
 */
class UpgradeRuleModel extends ContentRuleModel {
  constructor (props = {}) {
    super(props)
    this.rule_type = ALARM_RULE_UPGRADE
  }
}

/**
 * 发送规则
 */
class ForwardRuleModel extends ContentRuleModel {
  constructor ({ sendList, ...props }) {
    super(props)
    const cmdbConfig = _.pick(props, ['host_id', 'endpoint_id', 'metric_id'])
    this.rule_type = ALARM_RULE_FORWARD
    this.sendList = sendList.map(sendConfig => new SendModel({ ...sendConfig, ...cmdbConfig }))
  }

  serialize () {
    const { sendList = [] } = this
    return {
      ...super.serialize(),
      sendList: sendList.map(sendModel => sendModel.serialize())
    }
  }
}

/**
 * 消除规则
 */
class RecoverRuleModel extends ContentRuleModel {
  constructor (props = {}) {
    super(props)
    const { content = '{}' } = props
    this.rule_type = ALARM_RULE_RECOVER
    this.content = _.pick(JSON.parse(content), ['type', 'count', 'number'])
  }

  get count () {
    return this.content.count
  }

  set count (count) {
    this.content.count = count
  }
}

export class AlarmRuleModelFactory {
  static mapping = new Map([
    [ALARM_RULE_MERGE, MergeRuleModel],
    [ALARM_RULE_UPGRADE, UpgradeRuleModel],
    [ALARM_RULE_FORWARD, ForwardRuleModel],
    [ALARM_RULE_RECOVER, RecoverRuleModel]
  ])

  static create (model = {}) {
    const { rule_type, ...rest } = model
    return Reflect.construct(
      this.mapping.get(rule_type),
      [rest]
    )
  }

  static serialize (model = {}) {
    return model.serialize()
  }
}