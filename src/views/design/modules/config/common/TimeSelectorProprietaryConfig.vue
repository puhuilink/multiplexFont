<template>
  <div class="texts-config__template">
    <a-collapse :activeKey="['1']" :bordered="false">
      <a-collapse-panel header="属性设置" key="1">
        <div class="comment-template__item">
          <p class="comment-template__leading">时间类型：</p>
          <div class="comment-template__inner">
            <a-select v-model="config.proprietaryConfig.props.styleConfig.timeType" style="width: 120px">
              <a-select-option value="hour">一小时</a-select-option>
              <a-select-option value="day">一天</a-select-option>
              <a-select-option value="week">一周</a-select-option>
              <a-select-option value="month">一月</a-select-option>
            </a-select>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import ProprietaryMixins from '../proprietaryMixins'
export default {
  name: 'TimeSelectorProprietaryConfig',
  mixins: [ProprietaryMixins]
}
</script>

<style lang="less">
 .item {
   display: flex;
   flex-flow: row nowrap;
   justify-content: flex-start;
   align-items: center;
   margin-bottom: 12px;
   &__leading {
     flex: none;
     width: 70px;
     margin: 0;
     text-align: left;
   }
   &__inner {
     width: 100%;
     input {
       width: 100%;
     }
   }
 }
</style>
