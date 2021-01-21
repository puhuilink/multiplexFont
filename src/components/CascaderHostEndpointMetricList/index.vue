<template>
  <div class="CascaderHostEndpointMetricList">
    <div
      class="CascaderHostEndpointMetricList__item"
      v-for="(config, index) in content"
      :key="index"
    >
      <CascaderHostEndpointMetric :config="config" />
      <a-button type="link" icon="delete" @click="removeItem(index)" />
      <a-button type="link" icon="snippets" @click="copyItem(index)" />
    </div>
    <a-button type="link" icon="file-add" @click="addItem()" />
  </div>
</template>

<script>
import CascaderHostEndpointMetric from '~~~/CascaderHostEndpointMetric'
import _ from 'lodash'

export default {
  name: 'CascaderHostEndpointMetricList',
  mixins: [],
  components: {
    CascaderHostEndpointMetric
  },
  props: {
    content: {
      type: Array,
      default: () => [
        {
          'dictValue': [
            'Host',
            'HostLinux',
            'HostAIXLinux'
          ],
          'hostId': '21755076410478592',
          'endpointModelId': '1233261630',
          'metricModelId': '1233261631'
        },
        {
          'dictValue': [
            'Host',
            'HostLinux',
            'HostAIXLinux'
          ],
          'hostId': '25936887306915841',
          'endpointModelId': '1233261630',
          'metricModelId': '1233261631'
        }
      ]
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    copyItem (index) {
      const targetItem = this.content[index]
      const copyItem = _.cloneDeep(targetItem)
      this.addItem(copyItem)
    },
    addItem (item = {
      dictValue: [],
      hostId: null,
      endpointModelId: null,
      metricModelId: null
    }) {
      this.content.push(item)
    },
    removeItem (index) {
      this.content.splice(index, 1)
    }
  }
}
</script>

<style lang="less">
.CascaderHostEndpointMetricList {
  &__item {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}
</style>
