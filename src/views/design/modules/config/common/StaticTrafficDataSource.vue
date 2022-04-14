<template>
  <a-form-model class="ormDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="() => change(true)" />
    <a-form-model-item
      label="接口类型"
    >
      <a-input
        v-model="siteTrafficConfig.apiType"
        @change="change()"
      />
    </a-form-model-item><a-form-model-item
      label="请求类型"
    >
      <a-input
        v-model="siteTrafficConfig.requestType"
        @change="change()"
      /></a-form-model-item>
    <SiteTypeSelect
      :model.sync="siteTrafficConfig"
      :stateSwitch="switchSt"
    ></SiteTypeSelect>
    <Cache
      :model.sync="siteTrafficConfig"
    ></Cache>
    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
import SiteTypeSelect from '@/components/SdwanSiteComponent/SiteTypeSelect'
import Cache from '@/components/SdwanSiteComponent/Cache'
import PreviewButton from '@/views/design/modules/config/formItems/PreviewButton'
import RefreshTime from '@/views/design/modules/config/formItems/RefreshTime'
export default {
  name: 'StaticTrafficDataSource',
  mixins: [DataSourceMixins],
  props: {
    switchSt: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SiteTypeSelect,
    Cache,
    PreviewButton,
    RefreshTime
  }
}
</script>

<style scoped>

</style>
