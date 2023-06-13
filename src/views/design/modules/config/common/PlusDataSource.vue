<template>
  <a-form-model v-bind="formItemLayout">
    <PreviewButton :preview="preview" />
    <a-form-model-item label="发送方式" require>
      <a-input
        v-model="plusConfig.sendType"
      >
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="接口地址" require>
      <a-input
        v-model="plusConfig.address"
      >
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="返回值" require>
      <!--      <AceEditor-->
      <!--        class="editor"-->
      <!--        mode="text"-->
      <!--        theme="monokai"-->
      <!--        @change="code => {-->
      <!--          if (code) {-->
      <!--            plusConfig.back-->
      <!--          }-->
      <!--        }"-->
      <!--      ></AceEditor>-->
      <a-textarea
        v-model="plusConfig.back"
      ></a-textarea>
    </a-form-model-item>
    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
import { OriginSelect } from '~~~/Alarm'
import store from '@/store'
import AceEditor from 'vue-ace-editor-valid'

export default {
  name: 'PlusDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect,
    AceEditor
  },
  data () {
    return {
      cacheStatus: false
    }
  },
  methods: {
    cache (checked) {
      this.cacheStatus = checked
    }
  },
  computed: {
    isFollowed () {
      return store.getters.orm
    }
  },
  watch: {
    async isFollowed ([label, id]) {
      this.openConfig.cache = id
      await this.change(true)
    }
  }
}
</script>

<style scoped>
.editor {
  height: 100px !important;
  border-radius: 4px;
  background: #f1f1f1;
  font-size: 14px;
}
</style>
