/**
* 模板对应配置组件
* Author: dong xing
* Date: 2019/11/13
* Time: 2:17 下午
* Email: dong.xing@outlook.com
*/
import ViewConfig from './view/index.vue'
import Lines from './charts/Lines'
import Bar from './charts/Bar'
import Texts from './charts/Texts'
import Topology from './charts/Topology'
import Rects from './charts/Rects'
import Clock from './charts/Clock'
import CircleConfig from './charts/CircleConfig'
import TriangleConfig from './charts/TriangleConfig'
import ImageConfig from './charts/ImageConfig'
import Gauge from './charts/Gauge'
import DegreeRingConfig from './charts/DegreeRingConfig'
import AlarmListConfig from './elements/AlarmListConfig'
import TextHealthConfig from './charts/TextHealthConfig'
import ListConfig from './elements/ListConfig'
import PieConfig from './charts/PieConfig'
import PolarConfig from './charts/PolarConfig'
import UpsConfig from '@/views/design/modules/config/elements/UpsConfig'
import GlobalConfig from './charts/Global'
import SelectConfig from '@/views/design/modules/config/elements/SelectConfig'

// 图表模板配置
const charts = {
  Bar,
  Lines,
  Texts,
  Topology,
  Rects,
  Clock,
  CircleConfig,
  TriangleConfig,
  ImageConfig,
  Gauge,
  DegreeRingConfig,
  TextHealthConfig,
  PieConfig,
  PolarConfig,
  GlobalConfig
}

// 元素模板配置
const elements = {
  AlarmListConfig,
  ListConfig,
  UpsConfig,
  SelectConfig
}

// 模板配置组件
const CONFIG_COMPONENTS = {
  // 视图模板配置
  ViewConfig,
  ...charts,
  ...elements
}

export default CONFIG_COMPONENTS
