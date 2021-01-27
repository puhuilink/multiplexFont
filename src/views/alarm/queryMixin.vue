<script>
import CascaderDictValue from '~~~/CascaderDictValue'
import { Select as HostSelect } from '~~~/ResourceConfig/Host'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'

export default {
  name: 'QueryMixin',
  mixins: [],
  components: {
    CascaderDictValue,
    EndpointSelect,
    HostSelect,
    MetricSelect
  },
  props: {},
  data () {
    return {
      formItemLayout: {
        labelCol: { xs: { span: 14 }, md: { span: 8 }, xl: { span: 8 }, xxl: { span: 4 } },
        wrapperCol: { xs: { span: 10, offset: 0 }, md: { span: 14, offset: 0 }, xl: { span: 14, offset: 2 }, xxl: { span: 20, offset: 0 } }
      },
      colProps: {
        xl: 8,
        xm: 12,
        sm: 24
      }
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
