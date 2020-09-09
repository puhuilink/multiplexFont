<template>
  <fragment>
    <h3 class="title">告警消除</h3>
    <p class="RecoverForm__p">
      <span>告警消除时间范围</span>
      <a-form-model-item
        class="inline_input"
        prop="recover.number"
      >
        <a-input-number
          class="inline_input"
          :min="1"
          :parser="parserInt"
          v-model.number="formModel.recover.number"
        />
      </a-form-model-item>

      <span>分钟内，依次接收</span>

      <a-form-model-item
        class="inline_input"
        prop="recover.count"
        :rules="[
          { required: true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :min="1"
          :parser="parserInt"
          v-model.number="formModel.recover.count"
        />
      </a-form-model-item>
      <span>条正常数据</span>
    </p>
  </fragment>
</template>

<script>
import Mixin from './Mixin'

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
.RecoverForm {
  &__p {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;

    & > span {
      display: inline-block;
      margin: 0 4px;
      transform: translateY(10px);
    }
  }
}
</style>
