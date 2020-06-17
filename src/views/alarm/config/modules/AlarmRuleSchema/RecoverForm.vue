<template>
  <fragment>
    <p class="p">
      告警消除时间范围
      <a-input
        class="inline_input"
        :min="1"
        type="number"
        v-model.number="formModel.content.number"
      />
      分钟内，依次接收
      <a-input
        class="inline_input"
        :min="1"
        type="number"
        v-model.number="formModel.content.count"
      />
      条正常数据
    </p>
  </fragment>
</template>

<script>
import Mixin from './Mixin'
export const recoverFormRules = {}

export default {
  name: 'RecoverForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
