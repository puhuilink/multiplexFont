<template>
  <a-form-item
    label="关系类型"
    v-bind="formItemProps"
  >
    <a-select
      v-decorator="[
        'relationType',
        {
          rules: [
            {
              required: true,
              message: '所属分组必填'
            }
          ],
          initialValue: 'BelongsTo'
        },
      ]"
    >
      <a-select-option
        v-for="item in options.relationType"
        :key="item.value"
        :value="item.value"
      >{{ item.name }}</a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  name: 'RelationType',
  data: () => ({
    options: {
      relationType: [
        {
          name: 'Belongs To',
          value: 'LocationBelongsTo'
        },
        {
          name: 'Installed On',
          value: 'InstalledOn'
        },
        {
          name: 'Located in',
          value: 'LocatedIn'
        },
        {
          name: 'Related To',
          value: 'RelatedTo'
        },
        {
          name: 'Connected To',
          value: 'ConnectedTo'
        },
        {
          name: 'Pointed To',
          value: 'PointedTo'
        },
        {
          name: '交易路径下一环节',
          // TODO: 待定
          value: '交易路径下一环节'
        },
        {
          name: '位置归属于',
          // TODO: 待定
          value: '位置归属于'
        }
      ]
    }
  })
}
</script>

<style lang="less">

</style>
