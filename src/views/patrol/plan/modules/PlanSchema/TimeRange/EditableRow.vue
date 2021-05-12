<script>
import moment from 'moment'

export default {
  name: 'EditableRow',
  mixins: [],
  components: {},
  props: {
    format: {
      type: String,
      default: 'HH:mm'
    },
    value: {
      type: Object,
      default: () => ({ value: { time: new Date(), dayType: '' } })
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {},
  render () {
    const { format, value } = this
    return (
      <div class="TimeRangeEditableRow">
        <a-select
          value={value.dayType}
          onChange={(dayType) => {
            this.$emit('change', { ...value, dayType })
          }}
        >
          <a-select-option value="A">今天</a-select-option>
          <a-select-option value="B">明天</a-select-option>
        </a-select>

        <a-time-picker
          allowClear={false}
          format="HH:mm"
          value={(value.time === '') ? null : moment(value.time, 'HH:mm')}
          onChange={(time) => {
            this.$emit('change', { ...value, time: time.format(format) })
          }}
        />
      </div>
    )
  }
}
</script>

<style lang="less">
.TimeRangeEditableRow {
  width: 100%;
  display: flex;
  flex-direction: row;

  .ant-select {
    width: 80px !important;
  }
}
</style>
