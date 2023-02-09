<template>
  <div class="wd">
    <div :class="[advanced ? 'upper-fix' : 'upper-flex', 'upper-common']">
      <single></single>
      <toggleBtn :advanced="advanced" @click="changeBtn" class="upper-btn" style="color: #ffffff"></toggleBtn>
    </div>
    <a-table :columns="columns" :data-source="data">
      <!--      <span slot="customTitle"><a-tooltip title="使用该排班的分派策略、智能降噪或风暴预警"><a-icon type="info-circle" />关联信息</a-tooltip></span>-->
      <span slot="action">
        <a @click="onEdit"><a-tooltip title="编辑"><a-icon type="edit" /></a-tooltip></a>
        <a-divider type="vertical" />
        <a><a-tooltip title="删除"><a-icon type="delete" /></a-tooltip></a>
      </span>
    </a-table>
    <schema ref="schema" ></schema>
  </div>
</template>

<script>
import single from './components/singlePlan'
import toggleBtn from '@/components/Mixins/Table/Button/ToggleBtn'
import schema from './components/schema'
const columns = [
  { title: '排班名称', dataIndex: 'name', key: 'name' },
  { title: '成效时间', dataIndex: 'age', key: 'age' },
  { title: '最后一次编辑时间', dataIndex: 'address', key: 'address' },
  { title: '排班人员', dataIndex: 'people', key: 'x' },
  { slots: { title: 'customTitle' }, dataIndex: '', key: 'x' },
  { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' } }
]

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
  }
]
export default {
  name: 'Index',
  components: { single, toggleBtn, schema },
  data () {
    return {
      advanced: false,
      data,
      columns
    }
  },
  methods: {
    changeBtn () {
      this.advanced = !this.advanced
    },
    onEdit () {
      this.$refs.schema.show('编辑')
    }
  }
}
</script>

<style lang="less" scoped>
.wd {
  width: 100%;
}
.upper {
  &-common {
    display: flex;
    align-content: center;
    justify-content: center;
    background-color: grey;
    opacity: 0.5;
    padding: 20px;
    overflow: hidden;
  }
  &-fix {
    height: 80px;
   }

  &-btn {
    float: right;
  }
}
</style>
