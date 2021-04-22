<template>
  <div class="texts-config__template">
    <a-collapse :activeKey="['1']" :bordered="false">
      <a-collapse-panel header="属性设置" key="1">
        <div class="comment-template__item">
          <p class="comment-template__leading">地址：</p>
          <div class="comment-template__inner">
            <a-input
              v-model="config.proprietaryConfig.props.styleConfig.addr"
              @change="change()"
            />
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import ProprietaryMixins from '../proprietaryMixins'
export default {
  name: 'UpsProprietaryConfig',
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
