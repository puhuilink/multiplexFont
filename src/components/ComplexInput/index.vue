<template>
  <fragment>
    <a-form-model-item
      label="监控对象"
      prop="deviceBrand"
      v-bind="formItemLayout"
      :rules="[
        { required: true, message: '请选择监控对象' }
      ]">
      <a-input :disabled="true" :value="inputEle.deviceType"></a-input>
    </a-form-model-item>
    <a-form-model-item
      v-bind="formItemLayout"
      label="检查实体"
      prop="deviceBrand"
      :rules="[
        { required: true, message: '请选择检查实体' }
      ]">
      <a-input :disabled="true" :value="inputEle.deviceBrand"></a-input>
    </a-form-model-item>
    <a-form-model-item
      v-bind="formItemLayout"
      label="检查项"
      prop="deviceBrand"
      :rules="[
        { required: true, message: '请选择检查项' }
      ]">
      <a-input :disabled="true" :value="inputEle.deviceModel"></a-input>
    </a-form-model-item>
  </fragment>
</template>

<script>

export default {
  name: 'ComplexInput',
  data () {
    return {
      inputEle: {
        deviceType: '',
        deviceBrand: '',
        deviceModel: ''
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 15, offset: 1 }
      }
    }
  }
}
</script>

<style scoped>

</style>
