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

class Rule {
  constructor ({
    title,
    host_id,
    endpoint_id,
    metric_id,
    rule_type
  }) {
    this.title = title
    this.host_id = host_id
    this.endpoint_id = endpoint_id
    this.metric_id = metric_id
    this.rule_type = rule_type
  }

  serialize () {
    return _.toPlainObject(this)
  }

  deSerialization () {
    return _.toPlainObject(this)
  }
}

class MergeRule extends Rule {
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

class ForwardRule extends Rule {}

class RecoverRule extends Rule {
  constructor ({ content = '{}', ...rest }) {
    super(rest)
    this.content = _.pick(JSON.parse(content), ['type', 'count', 'number'])
  }

  serialize () {
    const { content, ...rest } = this
    return _.toPlainObject({
      ...rest,
      content: JSON.stringify(content)
    })
  }
}

class UpgradeRule extends MergeRule {}

export class RuleFactory {
  static mapping = new Map([
    [ALARM_RULE_MERGE, MergeRule],
    [ALARM_RULE_UPGRADE, UpgradeRule],
    [ALARM_RULE_FORWARD, ForwardRule],
    [ALARM_RULE_RECOVER, RecoverRule]
  ])

  static create (model = {}) {
    return Reflect.construct(
      this.mapping.get(model.rule_type),
      [model]
    )
  }

  static serialize (model = {}) {
    return this.create(model).serialize()
  }

  static deSerialization (model = {}) {
    return this.create(model).deSerialization()
  }
}
