import {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER,
  ruleTypeMapping,
  SEND_TYPE_EMAIL,
  SEND_TYPE_SMS
} from '../../typing'
import _ from 'lodash'

export {
  SEND_TYPE_EMAIL,
  SEND_TYPE_SMS,
  ruleTypeMapping
}

export const CONTENT_TYPE_COUNT = 'count'
export const CONTENT_TYPE_TIME = 'time'
export {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER
}

class ContentModel {
  constructor (content = '{}') {
    Object.assign(this, _.pick(JSON.parse(content), ['type', 'number']))
  }

  serialize () {
    return _.pick(this, ['type', 'number'])
  }
}

/**
 * 合并规则
 */
class MergeContentModel extends ContentModel {}

/**
 * 升级规则
 */
class UpgradeContentModel extends ContentModel {}

/**
 * 发送规则
 */
class ForwardContentModel extends ContentModel {
  constructor ({ sendList, ...props }) {
    super(props)
    const cmdbConfig = _.pick(props, ['hostId', 'endpointModelId', 'metricModelId'])
    this.ruleType = [ALARM_RULE_FORWARD]
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
class RecoverContentModel extends ContentModel {
  constructor (content = '{}') {
    super(content)
    Object.assign(this, _.pick(JSON.parse(content), ['count', 'number']))
    this.type = 'time'
  }

  serialize () {
    return _.pick(this, ['type', 'count', 'number'])
  }
}

export const contentModelMapping = new Map([
  [ALARM_RULE_MERGE, MergeContentModel],
  [ALARM_RULE_UPGRADE, UpgradeContentModel],
  [ALARM_RULE_FORWARD, ForwardContentModel],
  [ALARM_RULE_RECOVER, RecoverContentModel]
])

export class SendModel {
  constructor ({
    id,
    hostId,
    endpointModelId,
    metricModelId,
    event_level,
    send_type = '',
    contact = '',
    temp_sms_id,
    temp_email_id
  } = {}) {
    this.id = id
    this.hostId = hostId
    this.endpointModelId = endpointModelId
    this.metricModelId = metricModelId
    this.event_level = event_level
    this.send_type = send_type.split('/').filter(Boolean)
    this.contact = contact.split('/').filter(Boolean)
    this.temp_sms_id = temp_sms_id
    this.temp_email_id = temp_email_id
  }

  toggleEmail () {
    const index = this.send_type.indexOf(SEND_TYPE_EMAIL)
    if (index === -1) {
      this.send_type.push(SEND_TYPE_EMAIL)
    } else {
      this.send_type.splice(index, 1)
    }
  }

  toggleSMS () {
    const index = this.send_type.indexOf(SEND_TYPE_SMS)
    if (index === -1) {
      this.send_type.push(SEND_TYPE_SMS)
    } else {
      this.send_type.splice(index, 1)
    }
  }

  get hasEnabledEmail () {
    return this.send_type.includes(SEND_TYPE_EMAIL)
  }

  get hasEnabledSMS () {
    return this.send_type.includes(SEND_TYPE_SMS)
  }

  // 仅写入数据库时用到
  get temp_id () {
    const tempIdList = []
    const { send_type, temp_sms_id, temp_email_id } = this

    send_type.includes(SEND_TYPE_EMAIL) && tempIdList.push(temp_email_id)
    send_type.includes(SEND_TYPE_SMS) && tempIdList.push(temp_sms_id)

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
    id = '',
    title = '',
    deviceType = '',
    deviceBrand = '',
    deviceModel = '',
    hostId = [],
    endpointModelId = '',
    metricModelId = '',
    enabled = true,
    ruleType = [],
    content = '{}'
  } = {}) {
    this.id = id
    this.title = title
    // this.deviceType = deviceType
    this.deviceType = 'test'
    this.deviceBrand = deviceBrand
    this.deviceModel = deviceModel
    this.hostId = hostId
    this.endpointModelId = endpointModelId
    this.metricModelId = metricModelId
    // https://github.com/vueComponent/ant-design-vue/issues/971
    this.enabled = ~~enabled
    this.ruleType = _.castArray(ruleType)
    this.content = content
    this.merge = new MergeContentModel()
    this.recover = new RecoverContentModel()
    this.upgrade = new UpgradeContentModel()
    const [currentRuleType] = this.ruleType
    if (currentRuleType && contentModelMapping.has(currentRuleType)) {
      this[currentRuleType] = Reflect.construct(
        contentModelMapping.get(currentRuleType),
        [this.content]
      )
    }
  }

  serialize () {
    const { content, enabled, ...rest } = this
    return _.toPlainObject({
      // content: content.serialize(),
      ...rest,
      enabled: !!enabled
    })
  }
}

export class AlarmRuleModelFactory {
  static create (model = {}) {
    return Reflect.construct(BasicRuleModel, [model])
  }

  static serialize (model = {}) {
    return model.serialize()
  }
}
