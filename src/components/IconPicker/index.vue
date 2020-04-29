/* eslint-disable standard/object-curly-even-spacing */
<template>
  <div class="icon-picker">
    <div class="comment-template__item" :class="{ 'icon-picker__clear': !icon.show}">
      <p class="comment-template__leading" v-if="icon.show">显示</p>
      <div class="comment-template__inner comment-template__end">
        <a-switch
          checkedChildren="显示"
          unCheckedChildren="不显示"
          v-model="icon.show"
          @change="change" />
      </div>
    </div>
    <!-- / 显示 -->

    <div v-if="icon.show">

      <div class="comment-template__item">
        <p class="comment-template__leading">宽:</p>
        <div class="comment-template__inner topology-config__editable">
          <a-input
            type="number"
            v-model.number="icon.width"
            min="0"
            @change="change" />
        </div>
      </div>
      <!-- / 宽 -->

      <div class="comment-template__item">
        <p class="comment-template__leading">高:</p>
        <div class="comment-template__inner topology-config__editable">
          <a-input
            type="number"
            v-model.number="icon.height"
            min="0"
            @change="change" />
        </div>
      </div>
      <!-- / 高 -->

      <div class="comment-template__item">
        <p class="comment-template__leading">位置:</p>
        <div class="comment-template__inner comment-template__end">
          <a-select
            v-model="icon.position"
            @change="change">
            <a-select-option value="inside">内置</a-select-option>
            <a-select-option value="custom">自定义</a-select-option>
          </a-select>
        </div>
      </div>
      <!-- / 位置 -->

      <div class="comment-template__item" v-if="icon.position === 'inside'" :class="{ 'icon-picker__clear': icon.position === 'inside'}">
        <div class="comment-template__inner icon-picker__list">
          <div
            class="icon-picker__icon"
            v-for="(item, index) of icons"
            :key="index"
            @click="iconChoose(index)"
          >
            <img :src="item.img" :class="{'active': icon.name === item.name}" alt="">
          </div>
        </div>
      </div>
      <!-- / 内置图标 -->

      <div class="comment-template__item icon-picker__clear" v-else>
        <p class="comment-template__leading">自定义:</p>
        <div class="comment-template__inner comment-template__end">
          <a-textarea v-model.trim="icon.img" @change="$emit('change')" />
        </div>
      </div>
      <!-- / 自定义图标 -->

    </div>

  </div>
</template>

<script>
import '@/assets/less/template.less'
import ApplicationModule from '@/assets/network-icons/ApplicationModule.png'
import ApplicationSystem from '@/assets/network-icons/ApplicationSystem.png'
import AppServicePort from '@/assets/network-icons/AppServicePort.png'
import DBOracle from '@/assets/network-icons/DB_Oracle.png'
import Firewall from '@/assets/network-icons/Firewall.png'
import icona1 from '@/assets/network-icons/icona1.png'
import icona2 from '@/assets/network-icons/icona2.png'
import icona3 from '@/assets/network-icons/icona3.png'
import icona4 from '@/assets/network-icons/icona4.png'
import icona5 from '@/assets/network-icons/icona5.png'
import IPS from '@/assets/network-icons/IPS.png'
import LB from '@/assets/network-icons/LB.png'
import Linux from '@/assets/network-icons/Linux.png'
import LogicRouter from '@/assets/network-icons/LogicRouter.png'
import MWIIS from '@/assets/network-icons/MW_IIS.png'
import MWTomcat from '@/assets/network-icons/MW_Tomcat.png'
import Router from '@/assets/network-icons/Router.png'
import Server from '@/assets/network-icons/Server.png'
import Storage from '@/assets/network-icons/Storage.png'
import Switch from '@/assets/network-icons/Switch.png'
import transfer from '@/assets/network-icons/transfer.png'
import VPN from '@/assets/network-icons/VPN.png'
import WAN from '@/assets/network-icons/WAN.png'
import Windows from '@/assets/network-icons/Windows.png'
import ApplicationSystem1 from '@/assets/network-icons/ApplicationSystem1.png'
import nwRouter1 from '@/assets/network-icons/nw-router1.png'
import nwRouter2 from '@/assets/network-icons/nw-router2.png'
import nwRouter3 from '@/assets/network-icons/nw-router3.png'
import Agent from '@/assets/network-icons/Agent.png'
import AirCondition from '@/assets/network-icons/AirCondition.png'
import Alarm from '@/assets/network-icons/Alarm.png'
import Alert from '@/assets/network-icons/Alert.png'
import BladeChassis from '@/assets/network-icons/BladeChassis.png'
import Cable from '@/assets/network-icons/Cable.png'
import Circle_blue_small from '@/assets/network-icons/Circle_blue_small.png'
import DB_SQLServer from '@/assets/network-icons/DB_SQLServer.png'
import Humidifier from '@/assets/network-icons/Humidifier.png'
import jfdwIcon from '@/assets/network-icons/jfdwIcon.png'
import MachineRoom from '@/assets/network-icons/MachineRoom.png'
import NetworkCluster from '@/assets/network-icons/NetworkCluster.png'
import nwApplicationSystem2 from '@/assets/network-icons/nw-ApplicationSystem2.png'
import Others from '@/assets/network-icons/Others.png'
import PAU from '@/assets/network-icons/PAU.png'
import PowerSwitch from '@/assets/network-icons/PowerSwitch.png'
import Rack from '@/assets/network-icons/Rack.png'
import RackTempSensor from '@/assets/network-icons/RackTempSensor.png'
import SmokeSensor from '@/assets/network-icons/SmokeSensor.png'
import StatNode_Total from '@/assets/network-icons/StatNode_Total.png'
import StorageCluster from '@/assets/network-icons/StorageCluster.png'
import UPS from '@/assets/network-icons/UPS.png'
import VideoSurveillanceSystem from '@/assets/network-icons/VideoSurveillanceSystem.png'
import VM from '@/assets/network-icons/VM.png'
import WaterChillers from '@/assets/network-icons/WaterChillers.png'
import WaterLeakage from '@/assets/network-icons/WaterLeakage.png'
import WirelessAP from '@/assets/network-icons/WirelessAP.png'

export default {
  name: 'IconPicker',
  props: {
    icon: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    icons: [
      { name: 'icona1', img: icona1 },
      { name: 'icona2', img: icona2 },
      { name: 'icona3', img: icona3 },
      { name: 'icona4', img: icona4 },
      { name: 'icona5', img: icona5 },
      { name: 'transfer', img: transfer },
      { name: 'ApplicationModule', img: ApplicationModule },
      { name: 'ApplicationSystem', img: ApplicationSystem },
      { name: 'AppServicePort', img: AppServicePort },
      { name: 'DBOracle', img: DBOracle },
      { name: 'Firewall', img: Firewall },
      { name: 'IPS', img: IPS },
      { name: 'LB', img: LB },
      { name: 'Linux', img: Linux },
      { name: 'LogicRouter', img: LogicRouter },
      { name: 'MWIIS', img: MWIIS },
      { name: 'MWTomcat', img: MWTomcat },
      { name: 'Router', img: Router },
      { name: 'Server', img: Server },
      { name: 'Storage', img: Storage },
      { name: 'Switch', img: Switch },
      { name: 'VPN', img: VPN },
      { name: 'WAN', img: WAN },
      { name: 'Windows', img: Windows },
      { name: 'ApplicationSystem1', img: ApplicationSystem1 },
      { name: 'nwRouter1', img: nwRouter1 },
      { name: 'nwRouter2', img: nwRouter2 },
      { name: 'nwRouter3', img: nwRouter3 },
      { name: 'Agent', img: Agent },
      { name: 'AirCondition', img: AirCondition },
      { name: 'Alarm', img: Alarm },
      { name: 'Alert', img: Alert },
      { name: 'BladeChassis', img: BladeChassis },
      { name: 'Cable', img: Cable },
      { name: 'Circle_blue_small', img: Circle_blue_small },
      { name: 'DB_SQLServer', img: DB_SQLServer },
      { name: 'Humidifier', img: Humidifier },
      { name: 'jfdwIcon', img: jfdwIcon },
      { name: 'MachineRoom', img: MachineRoom },
      { name: 'NetworkCluster', img: NetworkCluster },
      { name: 'nwApplicationSystem2', img: nwApplicationSystem2 },
      { name: 'Others', img: Others },
      { name: 'PAU', img: PAU },
      { name: 'PowerSwitch', img: PowerSwitch },
      { name: 'Rack', img: Rack },
      { name: 'RackTempSensor', img: RackTempSensor },
      { name: 'SmokeSensor', img: SmokeSensor },
      { name: 'StatNode_Total', img: StatNode_Total },
      { name: 'StorageCluster', img: StorageCluster },
      { name: 'UPS', img: UPS },
      { name: 'VideoSurveillanceSystem', img: VideoSurveillanceSystem },
      { name: 'VM', img: VM },
      { name: 'WaterChillers', img: WaterChillers },
      { name: 'WaterLeakage', img: WaterLeakage },
      { name: 'WirelessAP', img: WirelessAP }
    ]
  }),
  methods: {
    /**
     * 内置图标选择
     * @param index
     */
    iconChoose (index) {
      Object.assign(this.icon, this.icons[index])
      this.$emit('change')
    },
    change () {
      if (this.icon.show) {
        if (this.icon.position === 'inside') {
          const icon = this.icons.find(icon => icon.name === this.icon.name)
          Object.assign(this.icon, icon)
        }
      }
      this.$emit('change', this.icon)
    }
  }
}
</script>

<style scoped lang="less">
.icon-picker {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;

  &__list {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  }

  &__icon > img{
    flex: none;
    width: 24px;
    height: 24px;
    margin: 0 6px 6px 0;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;

    &.active {
      border-color: #1890ff;
    }
  }

  &__clear {
    margin: 0;
  }
}
</style>
