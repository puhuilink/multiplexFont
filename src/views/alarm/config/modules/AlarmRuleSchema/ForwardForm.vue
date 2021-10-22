<template>
  <fragment>
    <h3 class="title">告警频率</h3>
    <div class="RecoverForm__p">
      <span>告警产生后</span>
      <a-form-model-item
        class="inline_input"
        :rules="[
          { required: true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          v-model.number="_formModel.forward.frequencyStart"
        />
      </a-form-model-item>

      <span>小时之后每</span>

      <a-form-model-item
        class="inline_input"
        :rules="[
          { required: true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          v-model.number="_formModel.forward.number"
        />
      </a-form-model-item>
      <span>分钟发送一次</span>
      <a-popover
        placement="topRight"
      >
        <template
          slot="content"
        >
          <p>为0则不限</p>
        </template>
        <a-icon type="info-circle"></a-icon>
      </a-popover>
    </div>

    <p class="RecoverForm__p">
      <span>告警产生后</span>
      <a-form-model-item
        class="inline_input"
        :rule="[
          { required:true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :width="50"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          v-model.number="_formModel.forward.frequencyStart"
        />
      </a-form-model-item>

      <span> 小时- </span>

      <a-form-model-item
        class="inline_input"
        :rule="[
          { required:true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          @change="toggleTime"
          v-model.number="_formModel.forward.frequencyEnd"
        />
      </a-form-model-item>
      <span>之间每</span>
      <a-form-model-item
        class="inline_input"
        :rules="[
          { required: true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          v-model.number="_formModel.forward.number24"
        />
      </a-form-model-item>
      <span>分钟发送一次</span>
    </p>
    <p class="RecoverForm__p">
      <span>告警产生后</span>
      <a-form-model-item
        class="inline_input"
        :rules="[
          { required: true, message: '请输入', }
        ]"
      >
        <a-input-number
          class="inline_input"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          @change="toggleTime"
          v-model.number="_formModel.forward.frequencyEnd"
        />
      </a-form-model-item>

      <span>小时之后每</span>

      <a-form-model-item
        class="inline_input"
        :rules="[
          { required: true, message: '请输入' }
        ]"
      >
        <a-input-number
          class="inline_input"
          :disabled="!isEdit && !isAdd"
          :min="1"
          :parser="parserInt"
          v-model.number="_formModel.forward.number48"
        />
      </a-form-model-item>
      <span>分钟发送一次</span>
    </p>
  </fragment>
</template>

<script>
import Mixin from './Mixin'

export const forwardFormRules = {}

export default {
  name: 'ForwardForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({}),
  methods: {
    toggleTime () {
      return this._formModel.forward.frequencyEnd < this._formModel.forward.frequencyStart ? '' : this._formModel.forward.frequencyEnd
    }
  },
  created () {
    this._formModel.forward.type = 'time'
  }
}
</script>
<style lang="less">
  .RecoverForm {
    .inline_input {
      display: inline-block;
    }
    &__p {
      display: flex;
      width: 100%;
      height: 20%;
      text-align: center;
      justify-content: center;

      & > span {
        display: inline-block;
        margin: 0 1px;

      }
    }
  }
</style>
