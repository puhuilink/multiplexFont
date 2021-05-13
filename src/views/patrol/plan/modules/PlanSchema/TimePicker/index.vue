<template>
  <div class="TimePicker">
    <a-row>
      <a-col :span="12">
        <span class="ant-form-item-label">生效时间:</span>
        <a-form-model-item prop="effectTime" class="TimePicker__item">
          <a-date-picker
            style="min-width: 260px"
            ref="effectTime"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="plan.effectTime"
            class="TimePicker__column"
          ></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <span class="ant-form-item-label">失效时间:</span>
        <a-form-model-item prop="expireTime" class="TimePicker__item">
          <a-date-picker
            ref="expire"
            style="min-width: 260px"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="plan.expireTime"
            class="TimePicker__column"
          ></a-date-picker>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import mixin from '../mixin'
import moment from 'moment'
export const TimePickerRule = {
  // effectTime: [
  //   { required: true,
  //     message: '请输入生效时间',
  //     validator: (rule, value, callback) => {
  //       console.log(this)
  //     }
  // const format = 'HH:mm:ss MM/D/YYYY'
  // const startTime = moment(value, format)
  // const endTime = moment(this.$refs.expire.value, format)
  // console.log(moment(startTime).isAfter(endTime))
  // if (moment(startTime).isAfter(endTime) && endTime) {
  //   callback(new Error('生效时间不能晚于失效时间'))
  // } else {
  //   callback()
  // }
  //   }
  // ],
  expireTime: [
    { required: true,
      message: '请输入失效时间',
      validator (rule, value, callback) {
        const format = 'HH:mm:ss MM/D/YYYY'
        const startTime = moment(value, format)
        const endTime = moment(this.$refs.expire.value, format)
        if (moment(startTime).isBefore(endTime) && startTime) {
          callback(new Error('生效时间不能晚于失效时间'))
        } else {
          callback()
        }
      }
    }
  ]
}
export default {
  name: 'TimePicker',
  mixin: [mixin],
  props: {
    plan: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    _value: {
      get () {
        return this.plan
      },
      set (value) {
        this.$emit('update:plan', value)
      }
    }
  }
}
</script>

<style lang="less">
  .TimePicker {
    margin-top: 5%;
    &__item {
      margin-left: 5%;
    }
  }
</style>
