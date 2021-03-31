<template>
  <div class="AlarmStatus__badge_group">
    <div class="AlarmStatus__badge_item">
      <a-icon v-bind="badgeProps(1)" />
      <span>紧急</span>
    </div>

    <div class="AlarmStatus__badge_item">
      <a-icon v-bind="badgeProps(2)" />
      <span>主要</span>
    </div>

    <div class="AlarmStatus__badge_item">
      <a-icon v-bind="badgeProps(3)" />
      <span>次要</span>
    </div>

    <div class="AlarmStatus__badge_item">
      <a-icon v-bind="badgeProps(4)" />
      <span>一般</span>
    </div>

    <div class="AlarmStatus__badge_item">
      <a-icon v-bind="badgeProps(5)" />
      <span>正常</span>
    </div>
  </div>
</template>

<script>
import { pureLevelColorMapping } from '@/components/Alarm/color.config'

export default {
  name: 'AlarmStatusBadgeGroup',
  mixins: [],
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {
    badgeProps (level) {
      return {
        style: {
          color: pureLevelColorMapping.get(level)
        },
        theme: 'filled',
        type: 'flag'
      }
    }
  }
}
</script>

<style lang="less">
.AlarmStatus {
  &__badge_group {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  &__badge_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
    padding: 2px;
  }
}
</style>
