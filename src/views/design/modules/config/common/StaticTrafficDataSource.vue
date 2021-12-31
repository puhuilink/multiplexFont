<template>
  <a-form-model class="ormDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />
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
import PreviewButton from '@/views/design/modules/config/formItems/PreviewButton'
import RefreshTime from '@/views/design/modules/config/formItems/RefreshTime'
export default {
  name: 'StaticTrafficDataSource',
  mixins: [DataSourceMixins],
  components: {
    SiteTypeSelect,
    PreviewButton,
    RefreshTime
  }
}
</script>

<style scoped>

</style>
