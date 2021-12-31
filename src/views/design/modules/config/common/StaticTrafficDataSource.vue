<template>
  <a-form-model class="ormDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="() => change(true)" />
    <SiteTypeSelect
      :model.sync="siteTrafficConfig"
    ></SiteTypeSelect>

    <RefreshTime @change="change()" />
    <!--      <a-form-model-item label="使用缓存">-->
    <!--        <a-switch-->
    <!--          checkedChildren="显示"-->
    <!--          unCheckedChildren="不显示"-->
    <!--          @change="cache" />-->
    <!--      </a-form-model-item>-->
    <!--      <a-form-model-item label="缓存数据名称" >-->
    <!--        <a-input-->
    <!--          v-model="ormConfig.cache"-->
    <!--        ></a-input>-->
    <!--      </a-form-model-item>-->
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
import SiteTypeSelect from '@/components/SdwanSiteComponent/SiteTypeSelect'
export default {
  name: 'StaticTrafficDataSource',
  mixins: [DataSourceMixins],
  components: {
    SiteTypeSelect
  }
}
</script>

<style scoped>

</style>
