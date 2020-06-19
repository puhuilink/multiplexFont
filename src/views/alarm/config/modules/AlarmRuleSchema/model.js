import {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER
} from '../../typing'
import _ from 'lodash'

export const CONTENT_TYPE_COUNT = 'count'
export const CONTENT_TYPE_TIME = 'time'
export {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER
}

class BasicRule {
  constructor ({
    id,
    title,
    host_id,
    endpoint_id,
    metric_id,
    rule_type
  } = {}) {
    this.id = id
    this.title = title
    this.host_id = host_id
    this.endpoint_id = endpoint_id
    this.metric_id = metric_id
    this.rule_type = rule_type
  }

  serialize () {
    return _.toPlainObject(this)
  }

  deSerialize () {
    return _.toPlainObject(this)
  }
}

class ContentRule extends BasicRule {
  constructor ({ content = '{}', ...rest }) {
    super(rest)
    this.content = _.pick(JSON.parse(content), ['type', 'number'])
  }

  serialize () {
    const { content, ...rest } = this
    return _.toPlainObject({
      ...rest,
      content: JSON.stringify(content)
    })
  }
}

/**
 * 合并规则
 */
class MergeRule extends ContentRule {
  constructor (props = {}) {
    super(props)
    this.rule_type = ALARM_RULE_MERGE
  }
}

/**
 * 升级规则
 */
class UpgradeRule extends ContentRule {
  constructor (props = {}) {
    super(props)
    this.rule_type = ALARM_RULE_UPGRADE
  }
}

/**
 * 发送规则
 */
class ForwardRule extends ContentRule {
  constructor (props = {}) {
    super(props)
    this.rule_type = ALARM_RULE_FORWARD
  }
}

/**
 * 消除规则
 */
class RecoverRule extends ContentRule {
  constructor (props = {}) {
    super(props)
    const { content = '{}' } = props
    this.rule_type = ALARM_RULE_RECOVER
    this.content = _.pick(JSON.parse(content), ['type', 'count', 'number'])
  }
}

export class RuleFactory {
  static mapping = new Map([
    [ALARM_RULE_MERGE, MergeRule],
    [ALARM_RULE_UPGRADE, UpgradeRule],
    [ALARM_RULE_FORWARD, ForwardRule],
    [ALARM_RULE_RECOVER, RecoverRule]
  ])

  static create (model = {}) {
    const { rule_type, ...rest } = model
    return Reflect.construct(
      this.mapping.get(rule_type),
      [rest]
    )
  }

  static serialize (model = {}) {
    return this.create(model).serialize()
  }

  static deSerialize (model = {}) {
    return this.create(model).deSerialize()
  }
}
