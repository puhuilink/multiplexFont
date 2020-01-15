<template>
  <div class=""></div>
</template>

<script>
export default {
  name: 'ResourceInstanceVersionList',
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: '编号',
            dataIndex: '_id_s',
            sorter: true,
            width: 180
          },
          {
            title: '创建时间',
            dataIndex: 'name_s',
            sorter: true,
            width: 300
          },
          {
            title: '版本',
            dataIndex: 'label_s',
            sorter: true,
            width: 300
          },
          {
            title: '名称',
            dataIndex: 'parentname_s',
            width: 300
          }
        ]
      }
    }
  },
  methods: {}
}
</script>

<style lang="less">

</style>
