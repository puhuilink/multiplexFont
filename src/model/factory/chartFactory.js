/**
* 图表工厂
* Author: dong xing
* Date: 2019/11/19
* Time: 5:36 下午
* Email: dong.xing@outlook.com
*/
import LineChart from '../charts/LineChart'
import BarChart from '../charts/BarChart'
import PieChart from '../charts/PieChart'
import TopologyChart from '../charts/TopologyChart'
import TextsChart from '../charts/TextsChart'
import RectChart from '../charts/RectChart'
import ClockChart from '../charts/ClockChart'
import CircleChart from '../charts/CircleChart'
import TriangleChart from '../charts/TriangleChart'
import ImageChart from '../charts/ImageChart'
import GaugeChart from '../charts/GaugeChart'
import DegreeRingChart from '../charts/DegreeRingChart'
import TextHealthChart from '../charts/TextHealthChart'
import PolarChart from '../charts/PolarChart'
import Global from '../charts/Global'

export default class ChartFactory {
  static create (type, { widget, onlyShow = false }) {
    switch (type) {
      case 'Lines':
        return new LineChart({ widget })
      case 'Bar':
        return new BarChart({ widget })
      case 'Pie':
        return new PieChart({ widget })
      case 'Polar':
        return new PolarChart({ widget })
      case 'Texts':
        return new TextsChart({ widget })
      case 'Topology':
        return new TopologyChart({ widget, onlyShow })
      case 'Rect':
        return new RectChart({ widget })
      case 'Clock':
        return new ClockChart({ widget })
      case 'Circle':
        return new CircleChart({ widget })
      case 'Triangle':
        return new TriangleChart({ widget })
      case 'Image':
        return new ImageChart({ widget })
      case 'Gauge':
        return new GaugeChart({ widget })
      case 'DegreeRing':
        return new DegreeRingChart({ widget })
      case 'TextHealth':
        return new TextHealthChart({ widget })
      case 'Global':
        return new Global({ widget })
      default:
        return null
    }
  }
}
