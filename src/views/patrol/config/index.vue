//巡更记录代码
<template>
  <div class="PatrolConfig">
    <a-spin :spinning="spinning">
      <!-- / 工作组 -->
      <div class="PatrolConfig__header">
        <div>
          <a-radio-group v-model="selectedGroupId" default-value="group_id" button-style="solid">
            <a-radio-button v-for="{ group_id, group_name } in groupList" :key="group_id" :value="group_id">
              {{ group_name }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div>
          <div class="PatrolConfig__header__search">
            <a-input class="PatrolConfig__header__search__input" allowClear v-model.trim="searchIinput" />
            <a-button type="primary"> 查询 </a-button>
          </div>
        </div>
        <div>
          <div class="PatrolConfig__header__addFun">
            <!-- <div>
              <a-button
                :disabled="disabtn"
                @click="addTableLists"
                class="PatrolConfig__header__search__input"
                type="primary"
                >新增监控对象</a-button
              >
            </div> -->
            <div>
              <a-button type="primary"> 下载 </a-button>
            </div>
          </div>
        </div>
      </div>

      <div class="PatrolConfig__content">
        <a-tabs @change="changeTitle">
          <a-tab-pane v-for="{ alias, id } in floorList" :key="id" :tab="alias">
            <!-- div 模拟table 表格 -->
            <div class="box">
              <div class="tabletitle">
                <!-- titleHeaderCheck -->
                <div class="titleHeaderCheck">点位</div>
                <div class="titleHeader">二维码</div>
                <div class="titleHeader">监控对象</div>
                <div class="titleHeader">监控实体</div>
                <div class="titleHeader">检查项</div>
                <div class="titleHeader">操作</div>
              </div>
              <div>
                <div
                  class="tableCount"
                  v-for="{ checkpointId, alias: checkpointAlias, hosts } in divcheckpoints"
                  :key="checkpointId"
                >
                  <div class="countCheck">
                    <span>
                      <a-checkbox ref="checkbox" @change="onCheckBox(checkpointId)"></a-checkbox>
                    </span>
                  </div>
                  <div class="countDiv1">
                    <span>{{ checkpointAlias }}</span>
                  </div>
                  <div class="countDiv1">
                    <span @click="qrCodeDownload(checkpointId)">下载</span>
                  </div>

                  <div class="countDiv2">
                    <div
                      class="countDiv3"
                      v-for="({ hostId, alias: hostAlias, endpoints }, index) in hosts"
                      :key="hostId"
                    >
                      <div class="countDiv3-div">{{ hostAlias }}</div>
                      <div class="countDiv4">
                        <div
                          class="countDiv5"
                          v-for="{ endpointId, alias: endpointAlias, metrics } in endpoints"
                          :key="endpointId"
                        >
                          <div class="countDiv5-div">
                            <span>{{ endpointAlias }}</span>
                          </div>
                          <div class="countDiv5-div">
                            <div
                              class="countDiv5Div-metricId"
                              v-for="{ metricId, alias: metricAlias } in metrics"
                              :key="metricId"
                            >
                              <div>
                                <span>{{ metricAlias }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="textClick">
                        <span class="cledit" @click="infoEdit(checkpointAlias,hostAlias)">编辑</span>
                        <span @click="() => hosts.splice(index, 1)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>

    <!-- 这里是===弹框 模块 -->
    <div>
      <a-modal v-model="visible" title="监控对象" @ok="handleOk">
        <div>
          <div class="modelPoint">巡更点位: {{ xgModelPoint }}</div>
          <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item
              label="监控对象"
              prop="modalEndpointId"
              :rules="[{ required: true, message: '请输入监控对象' }]"
            >
              <a-input placeholder="请输入监控对象" v-model="form.modalEndpointId" />
            </a-form-model-item>

            <div class="tablesStyle" v-for="(item, index) in form.shareParams" :key="index">
              <a-form-model-item
                label="监控实体"
                style="margin-bottom: 0"
                :prop="`shareParams.${index}.modelMetrics`"
                :rules="[{ required: true, message: '请输入监控实体' }]"
              >
                <a-input placeholder="请输入监控实体" v-model="item.modelMetrics" />
              </a-form-model-item>

              <a-form-model-item
                label="检查项"
                style="margin-bottom: 0"
                :prop="`shareParams.${index}.modalCheck`"
                :rules="[{ required: true, message: '检查项不能为空' }]"
              >
                <a-select v-model="item.modalCheck" placeholder="检查项不能为空">
                  <a-select-option value="value1"> 运行状态 </a-select-option>
                  <a-select-option value="value2"> 有无状态 </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item label="检查值" style="margin-bottom: 0">
                <a-form-model-item
                  :prop="`shareParams.${index}.modalCheckValue`"
                  :style="{
                    display: 'inline-block',
                    width: '100px',
                    marginBottom: 0,
                  }"
                  :rules="[{ required: true, message: '检查值不能为空' }]"
                >
                  <a-select v-model="item.modalCheckValue">
                    <a-select-option value="value4"> 运行状态 </a-select-option>
                    <a-select-option value="value5"> 有无状态 </a-select-option>
                  </a-select>
                </a-form-model-item>

                <span> 或值</span>

                <a-form-model-item
                  :prop="`shareParams.${index}.modalCheckId`"
                  :style="{
                    display: 'inline-block',
                    width: '100px',
                    marginBottom: 0,
                  }"
                  :rules="[{ required: true, message: '检查值不能为空' }]"
                >
                  <a-select v-model="item.modalCheckId">
                    <a-select-option value="value6"> 运行状态 </a-select-option>
                    <a-select-option value="value7"> 有无状态 </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>

              <a-form-model-item label="则需异常告警" style="margin-bottom: 0">
                <a-form-model-item
                  :prop="`shareParams.${index}.modalWarning`"
                  :style="{
                    display: 'inline-block',
                    width: '100px',
                    marginBottom: 0,
                  }"
                  :rules="[{ required: true, message: '检查值不能为空' }]"
                >
                  <a-input placeholder="请输入监控对象" v-model="item.modalWarning" />
                </a-form-model-item>

                <span> - - </span>

                <a-form-model-item
                  :prop="`shareParams.${index}.modalAbnormal`"
                  :style="{
                    display: 'inline-block',
                    width: '100px',
                    marginBottom: 0,
                  }"
                  :rules="[{ required: true, message: '检查值不能为空' }]"
                >
                  <a-input placeholder="请输入监控对象" v-model="item.modalAbnormal" />
                </a-form-model-item>
              </a-form-model-item>

              <a-form-model-item
                label="告警级别"
                style="margin-bottom: 0"
                :prop="`shareParams.${index}.modalWarningLevel`"
                :rules="[{ required: true, message: '告警级别不能为空' }]"
              >
                <a-select v-model="item.modalWarningLevel">
                  <a-select-option value="value8"> 运行状态 </a-select-option>
                  <a-select-option value="value9"> 有无状态 </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item v-show="form.shareParams.length > 1">
                <a-button type="primary" @click="removeParam(index)"> 删除 </a-button>
              </a-form-model-item>
            </div>
          </a-form-model>

          <a-form-model-item>
            <a-button type="primary" @click="addShareTable"> 添加 </a-button>
          </a-form-model-item>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { GroupService, PatrolService, PatrolConfigService } from '@/api'
import _ from 'lodash'
import { Confirm, List } from '@/components/Mixins'
import { tableMock } from './modules/tableMock'
import { downloadFile } from '@/utils/util'

export default {
  name: 'PatrolConfig',
  mixins: [Confirm, List],
  props: {},
  data () {
    return {
      dataLIstone: [],
      dataSource: [],
      floorTabIndex: 0,
      floorList: [],
      groupList: [],
      selectedGroupId: null,
      spinning: false,
      dataList: [],
      searchIinput: '',
      divcheckpoints: [], // div模拟表格
      visible: false,
      form: {
        modalEndpointId: '',
        shareParams: [
          {
            modelMetrics: '',
            modalCheck: '',
            modalCheckValue: '',
            modalCheckId: '',
            modalWarning: '',
            modalAbnormal: '',
            modalWarningLevel: ''
          }
        ]
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      xgModelPoint: '',
      disabtn: true
    }
  },
  computed: {
    colSpanMap: function () {
      return this.getColSpanByKeys(this.dataLIstone)
    }
  },
  mounted () {
    this.getMockData()
  },
  methods: {
    /**
     * 加载巡更组列表
     */
    async loadGroupList () {
      try {
        this.spinning = true
        const {
          data: { groupList }
        } = await GroupService.find({
          where: { is_patrol: true },
          fields: ['group_id', 'group_name'],
          alias: 'groupList'
        })
        this.groupList = groupList
        this.selectedGroupId = _.get(_.first(groupList), 'group_id')
      } catch (e) {
        this.groupList = []
        this.selectedGroupId = null
        throw e
      } finally {
        this.spinning = false
      }
    },
    /**
     * 加载巡更组下路线配置
     */
    async loadPathConfig (group_id = this.selectedGroupId) {
      try {
        const {
          data: { pathList }
        } = await PatrolService.pathFind({
          // where: { group_id },
          // TODO: 工作组未完全录入
          where: { group_id: 'patrolgroup-xmenv' },
          fields: ['floorList { alias id }'],
          alias: 'pathList'
        })
        const floorList = _.get(_.first(pathList), 'floorList')
        this.floorList = floorList
      } catch (e) {
        this.floorList = []
        throw e
      }
    },

    // 加载表格数据回调
    loadData (parameter) {
      Promise.all([
        new Promise((resolve, reject) => {
          return PatrolConfigService.dataSource().then((data) => {
            const zone = _.first(data)
            const tempList = this.setForLoop(zone)
            resolve(tempList)
          })
        })
      ]).then((res) => {
        // console.log('res', res)
        this.dataLIstone = res[0]
      })
    },

    // 这里是====div 创建表格
    getMockData () {
      console.log('11zhelis==11', this.tableMock)
      const { content } = tableMock
      console.log('11zhelis==', content)

      this.divcheckpoints = content[0].checkpoints
    },
    // page(num) {
    // this.divcheckpoints = tableDataOne.content[0].checkpoints.slice(num, num + 10)
    // },

    // 点击编辑
    infoEdit (pointsId, alias) {
      console.log('11', pointsId)
      console.log('222', alias)
      this.visible = true
      this.xgModelPoint = pointsId
      this.form.modalEndpointId = alias
    },

    handleOk () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.visible = false
          const formData = this.form
          console.log('这里是填充数据', formData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    addShareTable () {
      this.form.shareParams.push({
        modelMetrics: '',
        modalCheck: '',
        modalCheckValue: '',
        modalCheckId: '',
        modalWarning: '',
        modalAbnormal: '',
        modalWarningLevel: ''
      })
    },
    removeParam (index) {
      this.form.shareParams.splice(index, 1)
    },

    // 切换楼层导航更换表格内容
    changeTitle (key) {
      const index = this.floorList.findIndex((itemId) => itemId.id === key)
      const { content } = tableMock
      this.divcheckpoints = content[index].checkpoints
    },
    qrCodeDownload (id) {
      if (id !== '' || undefined) {
        PatrolService.qrCode(id).then((res) => {
          downloadFile('二维码.png', new Uint8Array(res))
        })
      }
    },
    onCheckBox (e) {
      this.disabtn = !true
      console.log('11', this.$refs.checkbox)
    }
    // addTableLists(el){
    //   console.log('e',el)
    //   this.disabtn = true
    //   this.visible = true
    // }

  },
  async created () {
    await this.loadGroupList()
    await this.loadPathConfig()
    await this.loadData()
  }
}
</script>

<style lang="less">
.PatrolConfig {
  &__header {
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    &__search {
      display: flex;
      &__input {
        margin-right: 6px;
      }
    }
    &__addFun {
      display: flex;
    }
  }
}

.textcheck {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50px;
  border: 1px solid grey;
}

.tablesStyle {
  background-color: #ccc;
  margin-bottom: 10px;
  padding: 13px 0 18px 0;
}

.modelPoint {
  margin-left: 28px;
  font-weight: 500;
  font-size: 14px;
}

//这里是重新设置的
.box {
  width: 100%;
  border: 0.4px solid gray;
}
.tabletitle {
  display: flex;
  width: 100%;
}
.titleHeaderCheck{
  display: flex;
  flex: auto;
  width: 100%;
  height: 40px;
  background-color: #ccc;
  line-height: 40px;
  justify-content: center;
  border: 1px solid grey;
}
.titleHeader {
  display: flex;
  flex: auto;
  width: 100%;
  height: 40px;
  background-color: #ccc;
  line-height: 40px;
  justify-content: center;
  border: 1px solid grey;
}

.tableCount {
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid grey;
  text-align: center;
}
.countCheck{
  display: flex;
  flex-direction: row;
  width: 4%;
  justify-content: center;
  border-right: 1px solid gray;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.countDiv1 {
  display: flex;
  flex-direction: row;
  width: 14.8%;
  justify-content: center;
  border-right: 1px solid gray;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.countDiv2 {
  flex: 1;
}
.countDiv3 {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid gray;
}
.countDiv4 {
  flex: 1;
}
.countDiv5 {
  display: flex;
  flex-direction: row;
}
.textClick {
  width: 25%;
  color: rgb(37, 99, 192);
  cursor: pointer;
}
.countDiv3-div {
  width: 25%;
  border-right: 1px solid gray;
  align-items: center;
  justify-content: center;
  display: flex;
}

.countDiv5-div {
  width: 50%;
  border-right: 1px solid gray;
  align-items: center;
  justify-content: center;
}
.countDiv5Div-metricId {
  border-bottom: 1px solid gray;
}

.cledit {
  margin-right: 6px;
}
</style>
