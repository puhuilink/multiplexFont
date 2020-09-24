import { AdaptorConfig } from './AdaptorConfig'

export class AdaptorAlarmConfig extends AdaptorConfig {
  constructor ({
    origin = '',
    deviceType = [],
    level = undefined,
    ...props
  }) {
    super(props)
    this.origin = origin
    this.deviceType = deviceType
    this.level = level
  }
}
