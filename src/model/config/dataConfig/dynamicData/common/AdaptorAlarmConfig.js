import { AdaptorConfig } from './AdaptorConfig'

export class AdaptorAlarmConfig extends AdaptorConfig {
  constructor ({
    origin = '',
    deviceType = [],
    ...props
  }) {
    super(props)
    this.origin = origin
    this.deviceType = deviceType
  }
}
