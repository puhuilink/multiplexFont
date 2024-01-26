<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row :gutter="[8, 8]">
          <a-col class="search_box">
            <label class="search_label">搜索条件</label>
            <a-button type="primary" @click="query(true)">
              <a-icon type="search" />
              查询
            </a-button>
            <a-button :style="{ marginLeft: '15px' }" @click="resetQueryParams">
              <a-icon type="sync" />
              重置
            </a-button>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="工作组名称" v-bind="formItemLayout" class="fw">
              <a-input placeholder="请输入工作组名称" allowClear v-model.trim="queryParams.name" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="是否启用" v-bind="formItemLayout" class="fw">
              <a-select allowClear v-model.trim="queryParams.isOpen">
                <a-select-option :value="'true'">
                  启用
                </a-select-option>
                <a-select-option :value="'false'">
                  停用
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <!-- <span class="collapse">
        <a-button @click="query" type="primary">查询</a-button>
        <a-button @click="resetQueryParams" >重置</a-button>
      </span> -->
    </a-form>

    <!-- / 操作区域 -->
    <div class="operation_box">
      <a-button type="primary" @click="onAddGroup" v-action:F001002001>
        <a-icon type="plus-circle" />
        新增
      </a-button>
    </div>
    <div class="wrapper_content">
      <div class="wrapper_content_left">
        <!-- <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" /> -->
        <div v-if="dataLoaded">
          <a-tree
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            :defaultExpandedKeys="expandedRowKeys"
            @expand="onExpand"
            @select="onSelect"
            :showIcon="true"
            :showLine="true">
          </a-tree></div>
      </div>
      <div class="wrapper_content_right">
        <a-table
          :columns="columns"
          :dataSource="defaultData"
          ref="table"
          :rowSelection="rowSelection"
          rowKey="id"
          :pagination="paginationOpt"
          :scroll="{x:1500}"
          :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''">
          <template #status="text, record">
            <a-switch :checked="text" @change="onStatusChange(record)" :disabled="record.id==='9527'?true:disabled" />
          </template>
          <template #action="text, record">
            <div v-if="record.id!=='9527'">
              <a @click="onEditUser(record)" v-action:F001002002><a-icon type="form" /> 编辑</a>
              <a-divider type="vertical" />
              <a @click="onDeleteUser(record)" v-action:F001002002><a-icon type="delete" /> 删除</a>
            </div>
            <div v-else>
              <a v-action:F001002005 @click="onAllocateUserGroup(record, key)">
                分配用户
              </a>
            </div>
          </template>
          <template #system="text, record">
            {{ text.patrol?'巡更路径':'' }}
            <a-divider type="vertical" v-if="!!(text.alarm&&text.patrol)"/>
            {{ text.alarm?'告警源':"" }}
          </template>
        </a-table>
      </div>
      <schema :userList="userList" :tree-data="treeData" ref="modal" @operateSuccess="query(true)"></schema>
    </div>

  </div>
</template>

<script>
import { RoleService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import { USER_FLAG } from '@/tables/user/enum'
import { axios } from '@/utils/request'
import { buildTree } from '@/utils/util'
import moment from 'moment'
import schema from './schema'
import { decrypt } from '@/views/SecurityMonitoring/view/dataCenter/aes'
import JSONBig from 'json-bigint'

export default {
  name: 'Role',
  mixins: [Confirm, List],
  components: {
    schema
  },
  data () {
    return {
      dataLoaded: false,
      selectedKeys: [], // 用于跟踪选中状态的数组
      treeData: [],
      selectTreeData: [],
      disabled: true,
      columns: Object.freeze([
        {
          title: '工作组名称',
          dataIndex: 'name',
          width: '180px',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          align: 'center'
        },
        {
          title: '是否启用',
          dataIndex: 'isOpen',
          key: 'isOpen',
          align: 'center',
          width: '150px',
          customRender: (el) => {
            return (<a-tag color={el ? 'blue' : 'red'}>{el ? '开启' : '关闭'}</a-tag>)
          }
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: '150px',
          align: 'center'
        },
        {
          title: '对接系统',
          dataIndex: 'system',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'system' }
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]),
      defaultData: [],
      selectedRows: [],
      paginationOpt: {},
      queryParams: {
        name: '',
        isOpen: null,
        createTimeStart: '',
        createTimeEnd: '',
        timeList: [],
        orgId: ''
      },
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      expandedRowKeys: ['1'],
      userList: []
    }
  },
  mounted () {
    this.initialPagination()
    this.query()
    this.getData()
    this.getUser()
    this.columns = this.columns.map(el => ({ ellipsis: true, ...el }))
    const user = JSONBig.parse(decrypt('rXmXPjAr+V8WL+IkWcXtSbY1Y1LaWntGw7o+LEu7Wtn2SY0iyqclGb+JyT7QtzGb3n1jYZJOmTIZaSoTp/1O3Aa+MuU8TXx2BMuxfY4qeIVaaNP5D1VlEuGPaxQpk54OZBXBartMCYtRK+A1YiXp2ghflbW5q4pTG4qsrut9yD+LrrQAL2VOAY9QAdWM/s2UnnCJzTChWVLqP3vtFc+crFkNU3c0UkFajowcNQ/uZcm+V9TMqjByDYU5tr+wL8LqrYCdYU3A2D2J9y3brGDtDi5ZhvJC+Sy2GMLF9ZCLPCR5j3uFT9M3MDc85kNth1ewLUQpB69+X5c2IWjCvE8JhvDEvCuAKlECC4lxjbgW35xxfsNeVMxBZ7aU0sz1r/Rcxt5KpnwR17C9cqRtAZjzceT4lytOJ60/J400CgXSLLw5frZ65m9c7Suc0wo116Lq2Zoq16W/otOfgvcCsOBJjQDwxEHA1jRqJSbllq6Blys1sq8rGvym05t+JgyIPd0oGJTEoQtmb4twP62prsWXDyG6JE+mhz6lX33vfck27o7ebIWHpeurvsi47wvh285joHBYaDw1CPWrjjbSeZIa/gsmrRNJk7ZAtxReEGsQ1KL0I/AdjYEj+R0XFs2QJqvmkeDLOLrsb5WG3P5HCoXLGU1tqz+E3/GXDDupKiTPapFdFp4c8OqsAE6Eh7Uh5f5DSVayTz80vccFYXEC+YEKwRpHDjM/1ZfMyeXiOCf/WF2KK1XwiifJ6wO4upODSgm1UmyrLofzL86TMUreM419b+lOOm4y4DImoHa6ecfmtH9//HPhPwmsoAp5ewSWJP/cGqYrO1GeGERkd+rkP1ts4xrNmdWpQjAYJzfOMsZCfq8in88t34iFSShb3P1YVkiRteHLGA0Sn/jno2cgCtzje7JfI6iHmQNOykHEREUO4PDdwrDUzmlT8yAko34cwPaioMYMZ9rIbq8P42kpjUvW+Jv2uJQBIzDEpzmmKXDKO149kHBFrtVL9SvcKOFjDTUmPueOX/eQ61ympFn6iuUprH149xz/n37ecDQihVWN1I+/b52/xDYyPYebBdM0heb1rZES4oLvi6E7vkL5vA6LlZxt/comuCSEp3/trv/h5XAnh4O7Z/lncl/qSlbOzdlrlNIY7tCgfr0Fatfv0uk8T9O5gdexnA22HEj5wuhvZTFK3Yzx0hoNMH1TKv576GUuljQB4o2WpJY0UEekLhC0oMSt8XJsfMMlH0HdH1kFvCBFBuPiPWnxTT0zywD5LN5tmL6vG8+czTok0WHQiRdt0E8uaHZxkiZ60ZPMGfHxe4sa30ZXgTTBuPIe6hcAsm9WiD1XhlLwTzT6DCW5V6a2OJYM8vC2laT0tWWGFM1Q3F/JUgZwKgKzoLI+0j6hFrbWrqqhVda4/wTEqzSwFh8v21NLgVeCd0gZVLkee2zb3b2EQqLD4BDylMP03HKLMCz8tUGhLromAQ+r2RLcZrfpmvscRog9qWQG156UzyI/9w/rEEcCWT9AB4arSu1f+xnaIZsGDxif47S7s+QWgD73DqAV260eA4aVv5feGyMsagHUo3AKj8DkOoK0Nj43dEFo9tmDs9WY9IEbYCSN593aYexjuCo/u7zOUirJKba4K1B7IKEfGgnsLnweMsmmSs+aZXlDcA4tDxxc4HppJlBKRDrTguIs/bNckaP11AZlqyL0jKCnnllPZRFsBB5CqjsMfrPcTztDRFGm5AcG4Zz36duSvMeVz3Gjj2X0SDxN0/H5EikCw15Vef3rZrJmiwuV7jczWwh4dLDpeBbGUYZ5DczcIFjTwLZ9LzHJMemznK4tfNZGOCdW/Goe50oadwxFP6Dp1crslsAvBqqKRM5EzjfTCJp289BCyGMMmAVQYGNSlaz9JVK1GSDqS0laXEn6IIp82H/KASCN4R8bVekhhtw0APYJw8kVbht9GmO0krTXoHxnUJHqM6jNViRFX5TVl59IiavZzIbTxYS3ipuq11jpLzvxNLq9zU36hvVwkFBDbwO/a/mLYSscIFVq7VB1htxmR2mO521bQkt1Fj6RulT0BF41xBYsfLWmbosv9TAZ9UKsLwXXhRmaFQ2AJCqbOjbKW4j0vgDzxQlVTxdmlgwu+muEbTZqN2yXRp4NoTfIOTftQ6QB8aCkb71QRqeiBUUCygJ1k8nMH/VoGNQZvuk777b0DV5aAP5kLljkKgT59uWrHSLDJ5vRhDOWxUuxUaO6bE+gqWNaLtgM0Bqpww16aqu1RWtEuBzopyhRiYHfCuDxcujctcZf4LLC5EP8prVs91kBgsI57EdjK/GCS45mIHqyfzHYTArMcbJm3L99SFaCi5uW7YlfdR+U5A6KjppKp9US2zstkHc8TnFNcWqL5h/M34vzwtHsY1PI1/UVhI4j7Q+l9p5ES00nbnbIFwox72kofa3soL11A5/2iFzfHSQdr+1pgtndjMMSjWA0XxiP3+F32f6bv+qXT76IH/DHel/TpJjUZlO1550kIJb/lbcpVVpvv98IRJLODRg/3OzKYE7KZif+fTrXZwAToYrmOi1oy79kmK9NV4+iiqcSuSHi5edSg4GtkXUDpV2bcZg3Rh+1vU8xg6qDvdmHWNTyQu1o374Sdzo6VEsuNo1ogGOfRDJ+IUFWuLmNPNzH2Ev5P4rPdPEb9QRU5tnniMx03I7/dV1JJiUgE3xTQicKb4Q5HGyx1ZKmQMp6+7oF+DIx46edkoclcLn9d8mOi4XvRYwi/jYk36Rsc4F90PzveR/KOHTedi+XdH0nJP2VIOXPPNGl6e7pXkr5e/FuFYeDGcyV1A/M0pg3gYEZqOpNulatrPn2hd6W326VOWTT9aVIbL13RASea18/t2Y6GkISNSk9CxN6QJPJVpGcKZPVoaQveqWbc6vFuawEFb6M8VLGngj9RnX0BsSBvnGGR3FpT5k4auavKJasRMDSo7d7w83KIxnpZq2P93EnUe6Q9OFVYl4SmJlW32cpQ0+xQGn6pZaAGN/QbcUpA5PLYVi6hi3jlOLOErYYqHcKGtDHLdAfsc4i1c9YkLjtnDys+27fGwFgZqoJpQkrZQINb4URD4eo9WfC6G4KI81qU9TE1LPOF8qhlFHD6MtpL6iGSit86GnU2NtmUKVbU7TNubGLPyUx7thvUGbBJuYZs6QRCqV8Haimk/rVUm8slqykSMqEjoK3M0cH/Lp1+eTbAyQfovmvlDAdj5vGw1TEuEcdpYTVZ1di0cqoCOgCtd1uO+eKeoVI4MbMj6Ig0IsbIHcKmvp29XHbDpDBaFG2LCQkMcyaQM8jnN1WbQaZDCW8MAKPtOQRUw0SAu3x8dJXT24aeqEBgybFQpAdD+8UlTsvtGHk8Cc/qPkGbgYfHvPDRgo9N9Hmws7DqJk/xex/wsHG3oco7EdZT6lmSFUSC5QljuxAcRkk3yAi0teqvPlZnd8YFyZI2ZqHRhCCQFHaE49zndxvcDE8ZczPUFvsmdpEpickwqofBgyruHCNspb1HoqDs1ooUjQVuA3U+5fVRCv0ft1aAA0x31MalOqy6KD3FkZ6vhmcYjGoUXNJ0z9UhipQ363L1POTlpM+5UOeHpbmEuu+NUzvhxcsXBMiMOePBibvEN2NUMYUL+m6LjabfzVCS/c/KsczaHePbHp1aA3P0ZEA4yy/GLuaaZakX7tiV5jvI4OdwFKnM8caSCa3LepNAbYX9HE38Zgwdi9zEBhVOlP2V4VbHYatrdmz9utxPbDef/nbJ7HYE1Q0kyZUC698VXUe7XZvznwTNEiFbuzeMYffMLTA9zdMul3tG77KPOj9VRAUt/q65w02j2ye4453ZlCySL6bOBalgh2jcwnk/ifMm5nnr5VSbjG4DYE8Mw0n0d2JIT7JRhTXsMkhUoCdkF3uAtGoIwxARyko2jqTFjVnJ0/VWYEUetFdcHNS1eiEFBy0fidSEdUjZO/1IerLxATY2jVwNJxGawSaOLfrcwB91QIxWjle1Ez1YoI1ft0dpFLncIPDN52/qwtlp09PUqM4CRx7IIYMGrIn6/Owg0JbPxPLP2bjEvMwOiZc8aGqEb6icsPo4vbjpsDoyffuDBDqjPj/1EBRY6XAz8iBYSHPJc2bHieVlSx0Hail/lgdqdyHB95VV8V7Txtob2w93EVxODRNswAFUo8T/Fna4rWgF+tJO9579HNebSe+bIi7l6wtJ70xK0g1PawCrV6E8a1w8ml29ZPipsEvsZhNtOJMllMrbP6NlSbCuDybGYzauwB1TNIYnprOL1vxGLUO7ASwX2m6SMmekZi2mfjGPQ0GVtyF/22GJtIPZnjIrKM0gLSh9+/8jpetNR5hVI2Qu/vkTgU1392sQkkUrlFwU+Le7HWwS0kCGmi4s2kqhETyV9njVmfYJmZgVlvI8oxKbCRUUpScjGACD93IKxIzULHBSpmJRkKdO9lHQg4ZWwF3XSsmJeXam8YzC0BKSsZjYIduInQJic0fJDjdyjfAacrxFb+TPwhiSVvIgHGz/d24XET+9+oqz8xWBVJBOCBMqmWY8YfSr2uMyisD2Vq3sS8oQYdw4v71ZPnSYcuN2d7ZFqlk9Wt6CZyImk1VbhtinU8nDOdhjjqBojyubZzhhHkOFzaZkKYhOEMnY0qYzmNyPhG4Ipa0usubCRSGkXnFbB83aGySqR7LA23iyv+ys6YPxejnFbIIWHwnhVGOSDQVn4Afp6SdNnnduKjl5dzcnnv0fB3DYygSCfKVJgODfF82GzUPfRaSUBOYtOgCm1YxB3pwXVJ2jONKX4U3RX1717bAGaMAwN0iUqu0GeJV7CwIQDskBSOISTTxXRe88tZ7VE+pCM0pHprf8QJqxgpaRN0RnPhciSBVUCnSvgBtf10UaNhKDagOFmxmtxiY2Gzz/3fJCflNRP6ybyqMkcqMdUvEMZOMsndikVpwU5ujG+/zo+bhMQgKy2F0JD0pcJZeP2xs4ogFWUkqLakn9hhfU0oVhtLGzZkyA6bQib+AH6vlvfSrNpO1I07/xIsjw0UKxRoerVqDCEecmTVFadlgVYYEGRKKjO9dgS7j8+4a6JeasLcK0orPqX7ACC7NAl0J7UD85Ov8VaES3OqgDXiz7Xn3pbwloERf+WdJyVqai/WbEoGJd5i4z0IYWW6WrHsiyEZf4+arwhi8nRmiV1cd95uEVX2JdMd9f9eCGR0bBuLVF5ecGtELcF2rcY4d05adlKiZukpc66CScwc253crgFQUryOJaVVbNiE6W56j2Y16IBEGQ1G4TP7pKApEZsXXIvwMdkqQ/ONyV0Ej0eLbBZrTt6WkMJliOSwVJH5cKR5wfOKuKi2p1BQ7NGPpMi3rwNgfKr1SVcwnbWW1EKUQHrZtVpgUUFhpKs7Ioovvg6SFxpToEr53mL+H4/wYvpt/uN6h9ZwG3pNUSZAaQP2YYZvlAuXFqZN8yxyYAnoyIdUFyLzxyBYRPgu9qxTvgjiE6hHb7Na5rysie5DOAfVl7dzAEfePYYyy/m9KqcWsEvmwKCiVP/h0BfrmqLnLEsrqyfZG9MEcvuWgPyJ3hklS9aeFTFsEseb7toDGtZpjDIn9UVzTejgZA4eaqQFZwB7pZu56WnTVKotr8xRtBIxT0ghLZRNISnmidCfYLMO2guvJuK1HFVTLleFqTe3cpgH6ocSUMr9HUKuxAwZ4r3HZG/ImPcKKwp0CQE6c4trkYjCdU4ysJF70hGB+2QHH3xCVTgIfyV57y9RswKFFm9SIvcoZlOuqGGBCFQrpGPda8IWYc0RwadF5tFQa2FinupwSmIsUc3/SJzy+BoZ1C7DYt7jLg+6CdzhTi3mCy9xmkM/opuxSXyZcXE2z4RtkMvRIvZ9ZDbq7VX35TXxaJBAMphKElq4WxEt0oKkN4uxnV97ddxxphYFXC1SHqopzAPf4K2sMYEiJomKWWc4lp8K2zTsGlJqXffZ3DSMtYKxO6LAkWvPiUpVJ4eLWqKEW6l1/as4imjxM0XEuRPiZmk3tvjZttTUaXzWjKzc38VsiueUEUGxrRy6w2Vbbtn6OVU7xPSDZa3ntKfJMDGYLTH3Ar6aNYx2naE7cRuwIHeXiUUseqe/fIsdBXBpBR5wo81Sb9muPIeUzQZSiTfQxkRt/jf4TwRWwvjFt2wdKz081Rw1g/WaBApJGJo3CFMoSvY3StJuNj0lP6bBLlLtHRRTM6YgVrESUA1CUyRmj7EM5IKctOWzLthqUEQy3GihZD3G8B3gjS+sSI6CK35VvsMehe/aTM6DBcoAySHGVlTUduWLEG2r/DBEhKCMg4cQASaimK0fCJkaS20PUF7mUcG6SNpQmRT9YNDbil4ICKcqMMGxubgZCQmFDzf3zXMuBodU2G2bfyNd6WkcTNEQN/T9K6d50Q/WUB9GE6qpdOblCKf+dp+vamIdP6Tn6RZ0GlgOZJxJ6ekglXwvZVh1ZW7YTS/b7PN43bEQ/w15Wk39RwtvsuvSrVCuvGeaxBNZ/sgGBGIpvKTqG6f1du6z30sJq83l2dRwAHwOevqlZ2uWIXqxus7Itj+kIV8qxjgHacdXIp0gRMBZOVHZU8/RA1J7AstkdcuvjQ9WGjmyUB3TipghKNgR4ZJPVsZIj+Njhab+wQUEE0DZ/9Y+vC+kKXTGBeR4iBoo1eZc8xjI1zfsxK8GaWCoCxeQthMfFwdexdcfWz2E/5LXL6k7ZTdz9Oh7gI568Nkxd/MxXZ6VMIoa4JzNZYlcOyubGFZSOnIx41ZMsCHTDoXNzFcLwfl448Nl958kPUstwJejOj5kQWjR7czU7Iwfi/aA3mtRuw3J1mzgIc0z8kRTguqN8dlDBx5Co2PuDcyuLJeSvl41SAhW6xkG935zzOOcsyxDwVU0LQ98lt5yhI4vspSCIgAV2j8dugJfBKgvwS2/V0cclE8a6CRdS1kuFheY+tdhTiLT7vc3OCbcq6musPAwBgAraGvjVzlf3n8NWXyqqq64GfhRPsMKMyJeOuHiYIdcVfI+NI3ArCKPjM/vvdjhsp3hj1jD6B8zmEAtmMahprJGSvTzNkExgMmv6W6O8QbOOae4fwqgRkO/6xfabh9DOlBX/kLN0SbBmSpoqRf6UtNIii9Ktnmn5iSBTp/F/uDhREher3jvYZnuqre9FLXQcrSJdw9K2RFDE09Eo1XrAyTo4lSiMENkCTqXJwHAAZkd9vQuQBFBh3l/R5INqiu6v8fsUiibQIUhlnt+0omqtY9FbMGTG8XsP/j1ZH3qyOJG+DcmKy44jHJSKUyCQt1xjzxlEWWxRk8j9/j8AlqtZHihHdynuNrLIi3BHMnC6a5/eTIvDB9hntl8d82KHED/s0YNUj6h7TR9YsNfcrXD1j3vOOX1v6quAhirN3xX9Fa9/CreehItHD/RRof2++DneHYUp+ZHhLjplqZj4/mTRmabEJA3nQJiXYHkYwPJy6fxK7WgUzrLXIKOVTWW4bWYjnUBx53wLnmlAxIbLnww4MIZMHJXroh1gD+lWr7/qzMoXEipf1lvGRaA8/oNUb78GlZo6d/fcuecPPj0Hiz61OGU6lj2Sn3ASeMjnuwQk0Ne3a7Nuu/hP7l0DpxHp5jrGc5BF30rGo47Z309F3DAZvswI0E5lO61ehe8tKuATMaT+EOlfvVQZb0o1zj83/boir6VWw5YU0s5PX62zNsbY0AFP9tdVeDYqqNhDUcVh+/3sjbW3oFhH0eAGkmbeBin0Qaq0BVFTUVBMdTzp8zF4dMtN/HtDW8Fcev0dks6Ckqhtexu85pHO7ambX95OCuMfMmQ/jJnQM6V/u6lUWORBgT2KHx5BxL7BXyvCmGA6Vx3dmclDl3iQ+9rpNzIzuAOc25y3YwSGIlWR6bC4UpYTjD5D5CQS2WlqPDCLELP7XMOaHcK9B3S0BT7c8h7hpPVZGziuCWQwvMxQfLpA3hS3Jd+HxLo5++5KUdbC4SH5QtHmq65Ga1LGlazo9KQBwChTmNqibIAhnR35hc5oN5QNq4405zw+4WWL0Kq9ezE31H7B8QkPICvUbfIHHLWjpJFee1V9kGBxq0FJ17itHR8d6D+wLQj7hsZ6SMm7tCZvEd67rl0Qu/1agSGC5Chnpm4uDlkMhtCYaZFd/vNidZPNR8vTyi5x8I6ZpP7LfSfFhp7n6ImMcEGujN5SG2S4DvjgbZZAugCSQR9kViiMsKOd+PMNZygYVsGpJdkN6xQ1R0aKnNZktO6H5MdPKjSYwW4Ck5dmDp3XonLaaB/W6fac1x0TqW4IROF6mlM8Fp8MKV7wdPGCfR6NqOm90BQocwTwfGOAzMrPM/HRUXOj1Ng1RAHqRLwWOk11JDsinhGlMOIofZY2+4E2j9m0QXW8Gh8ShFHU+WCdS9nTGDGxa65xBNWWq/DsR8aXy2t9Fa9UUTzjbOsnTH62+fkbLjMRmXqtiiI7cmHLVDDvf9tPpnpqbA4GQkJ7+VZAZLi2rkObm2K/7zW+qJxg/g1W2ulmoBY9I9/ecKNnJahFaQBJalfX047f2b2d87i7zed6R6d1qRlKuFVYkbGKXACJFp5pKqzFM7Jp1BPCabBHQrqn1aQTZE+wKSo+Peew4pJr4wygowc3QiX6RpUI2nldKRloLGXBKk8HSdwYRfCXr6gS59+XtIO/1Bw/aDbv35qshz0YgFEY2jl2iujjYb24xgMTT2A1g475TQOLXA8bWLTOMD8fCjth5z94Kvh4H9VthKep1Gq+3cUS8Q2l4pLfdZS/yyz65CR6Dnx2h3nPPRTC5iraDGOgiDQM5HDTOPhnX3qR1fuCcnBV09QgOLMkRnC5hsjH0BrB'))
    console.log('解密后:', user, user[0].userId.toString())
  },
  created () {
    const rolesData = localStorage.getItem('pro__Roles')
    if (rolesData) {
      // 如果存在，将数据转换为对象或数组，具体情况取决于您存储的数据格式
      const menuCodes = JSON.parse(rolesData).value.menuCodes
      const searchString = 'F001002007'// 角色管理状态开关
      if (menuCodes.indexOf(searchString) !== -1) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return !!selectedRows.find(({ flag }) => flag === USER_FLAG.enabled)
      } else {
        return false
      }
    }
  },
  methods: {
    // 左侧树
    moment,
    onSelect (selectedKeys) {
      // 节点被选择时 响应当前部门下的用户 到这
      this.queryParams.orgId = selectedKeys[0]
      this.selectedKeys = selectedKeys
      this.query()
    },
    // async getRoles () {
    //   const { data: { list } } = await axios.get('/role/list', {
    //     params: {
    //       pageNum: 1,
    //       pageSize: 9999
    //     }
    //   })
    //   this.roleList = list
    // },
    onExpand (expandedKeys) { // 节点展开时
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    // 获取用户列表
    async getUser () {
      try {
        const { data: { list } } = await axios.get('/user/list?pageSize=9999&pageNum=1')
        this.userList = list.map(el => _.pick(el, ['id', 'userName']))
      } catch (e) {
        throw e
      }
    },
    // 选择部门
    async getData () {
      const { data: { dataIds, list } } = await axios.get('/organize/list', {
        params: {
          isOpen: true
        }
      })
      this.banList = dataIds
      // console.log(this.banList);
      this.treeData = buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        if (!el.isOpen || this.operationShow(this.banList, el.id)) {
          el.disabled = true
        }
        return el
      }))
      this.selectTreeData = this.buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        if (!el.isOpen || this.operationShow(this.banList, el.id)) {
          el.disabled = true
        }
        return el
      }))
      // this.expandedRowKeys = [...this.selectTreeData[0].children.filter(el => _.get(el, 'children', []).length > 0).map(el => el.id), '1']
      this.dataLoaded = true
    },
    operationShow (List = [], id = '') {
      return List.indexOf(id) === -1
    },
    buildTree (data, parentId = null) {
      const tree = []
      for (const item of data) {
        if (item.parentId === parentId) {
          const children = this.buildTree(data, item.id)
          if (children.length > 0) {
            item.children = children.map(el => {
              return {
                ...el,
                label: el.name,
                value: el.id
              }
            })
          }
          tree.push({
            ...item,
            label: item.name,
            value: item.id
          })
        }
      }
      return tree
    },
    // -----------------------------
    onDateChange (date, dateString) {
      this.queryParams.createTimeStart = dateString[0]
      this.queryParams.createTimeEnd = dateString[1]
    },
    initialPagination () {
      this.paginationOpt = {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        current: 1,
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.current = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.current = current
          this.paginationOpt.defaultPageSize = size
          this.query()
        }
      }
    },
    resetQueryParams () {
      this.queryParams = {
        name: '',
        isOpen: null,
        createTimeStart: '',
        createTimeEnd: '',
        timeList: [],
        orgId: ''
      }
      this.selectedKeys = []
    },
    query (first = false) {
      if (first) {
        this.paginationOpt.current = 1
        this.$nextTick()
      }
      this.loadData(this.queryParams)
    },
    /**
     * 加载表格数据回调
     */
    async loadData (parameter) {
      // const res = await RoleService.find(name, isOpen, createTimeStart, createTimeEnd, orgId, this.paginationOpt.current, this.paginationOpt.defaultPageSize)
      const { data: { total, list, business } } = await axios.get('/group/list', {
        params: {
          pageNum: this.paginationOpt.current,
          pageSize: this.paginationOpt.pageSize,
          orgId: this.queryParams.orgId,
          isOpen: this.queryParams.isOpen,
          name: this.queryParams.name
        }
      })
      if (total) {
        const temp = list.map(el => {
          const index = business.findIndex(nl => nl.groupId === el.id)
          el.system = business[index]
          return el
        })
        this.defaultData = temp
        this.paginationOpt.total = Number(total)
      } else {
        this.defaultData = [
          {
            code: ' 080001',
            name: 'IT巡更角色',
            isOpen: false,
            defaultRole: false,
            remark: '机房IT巡更，运维角色，交接班，巡更。机房视频监控，仅IT...',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080002',
            name: '动环巡更角色',
            isOpen: true,
            defaultRole: false,
            remark: '机房动环巡更，运维角色，交接班，巡更。机房视频监控，仅....',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080003',
            name: '超级管理员',
            isOpen: true,
            defaultRole: true,
            remark: '所有权限',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080004',
            name: '监控角色',
            isOpen: true,
            defaultRole: true,
            remark: '机房监控、漏洞监控、安全态势感知；',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080005',
            name: '管理角色',
            isOpen: true,
            defaultRole: false,
            remark: '巡更管理、机房视频监控、机房监控、漏洞监控、安全态势感知；',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080006',
            name: '运维角色',
            isOpen: true,
            defaultRole: false,
            remark: '巡更管理，机房视频监控',
            createTime: '2023-11-21  08:50:08'
          }]
      }
    },
    onAddGroup () {
      this.$refs.modal.onAdd()
    },
    /**
     * 编辑工作组
     * @event
     */
    onEditUser (record) {
      this.$refs['modal'].edit(record)
    },
    onDeleteUser (record) {
      this.$promiseConfirmDelete({
        title: '删除',
        content: '确定要删除该角色吗',
        onOk: async () => {
          await axios.delete(`/group/${record.id}`)
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
            .catch(e => this.$message.error(e))
        }
      })
    },
    /**
     * 批量删除用户
     * @event
     */
    async onBatchDeleteUser () {
      const [{ flag }] = this.selectedRows
      const title = flag === USER_FLAG.enabled ? '无法删除' : '删除'
      const content = flag === USER_FLAG.enabled ? '只能删除无效用户' : '确定要删除选中的记录吗？'
      const onOk = flag === USER_FLAG.enabled ? 1 : 0
      this.$promiseConfirmDelete({
        title,
        content,
        onOk: () => {
          if (onOk === 1) {
          } else {
            RoleService.batchDelete(this.selectedRowKeys)
              .then(() => {
                this.$notifyDeleteSuccess()
                this.query(false)
              })
              .catch(e => this.$message.error(e))
          }
        }
      })
    },
    /**
     * 停用/启用角色
     * @event
     */
    async onStatusChange (record) {
      const title = !record.isOpen ? '启用' : '停用'
      const content = !record.isOpen ? '确定要启用角色吗？' : '确定要停用角色吗？'
      this.$promiseConfirmDelete({
        title,
        content,
        okType: 'primary',
        onOk: () => {
          RoleService.switchStatus(record.id, !record.isOpen)
            .then(() => {
              this.$notifyToggleFlagSuccess()
              this.query(false)
            })
            .catch(e => this.$message.error(e))
        }

      })
    },
    /**
     * 删除工作组
     * @event
     */
    async deleteRole (record) {
      this.$promiseConfirmDelete({
        title: '删除',
        content: '确定要删除该角色吗',
        onOk: async () => {
          await axios.delete(`/group/${record.id}`)
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
            .catch(e => this.$message.error(e))
        }
      })
    },

    /**
     * 重置用户密码
     * @event
     */
    onResetPwd () {
      const { userId } = this.$store.getters
      const [selectedUserId] = this.selectedRowKeys
      if (userId === selectedUserId) {
        this.$message.warning('当前账号密码请至个人中心重置！')
        return
      }
      this.$promiseConfirm({
        title: '系统提示',
        content: '是否重置选中用户密码？',
        onOk: () =>
          RoleService.setInitialPwd(_.first(this.selectedRowKeys))
            .then(() => {
              this.$notification.success({
                message: '系统提示',
                description: '密码已重置为初始化密码！'
              })
            })
            .catch(e => this.$message.error(e))
      })
    },
    /**
     * 变更用户状态
     * @event
     */
    async onToggleFlag () {
      const [{ user_id, flag }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认更改用户状态？',
        onOk: () =>
          RoleService.toggleFlag(user_id, flag === USER_FLAG.enabled ? USER_FLAG.disabled : USER_FLAG.enabled)
            .then(() => {
              this.$notifyToggleFlagSuccess()
              this.query(false)
            })
            .catch(e => this.$message.error(e))
      })
    },
    /**
     * 清除用户错误次数
     * @event
     */
    async onClearError () {
      const [{ user_id }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认解除用户限制？',
        onOk: () =>
          RoleService.clearError(user_id)
            .then(() => {
              this.$notifyClearErrorSuccess()
              this.query(false)
            })
            .catch(e => this.$message.error(e))
      })
    },
    moreOption (record, { key }) {
      switch (Number(key)) {
        case 1:
          this.onUpdateMenu(record)
          break
        case 2:
          this.onUpdateData(record)
          break
        case 3:
          this.onAllocateUserGroup(record)
          break
        case 4:
          this.deleteRole(record)
          break
      }
    }

  }
}
</script>

<style lang="less">
.wrapper {
  // padding: 8px 0;
  &_content {
    margin-top: 3px;
    display: flex;
    justify-content: space-between;

    &_left {
      width: 20vw;
      background-color: rgba(250, 250, 250);
      border: rgb(232, 232, 232) 1px solid;
      border-radius: 5px;
      padding: 5px;
      overflow: scroll;
      margin-left: 23px;
    }

    &_right {
      width: 70vw;
      margin-left: .3vw;
    }
  }
}
</style>
