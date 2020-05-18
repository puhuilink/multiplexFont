
<script>
import CheckboxField from './CheckboxField'
import DatetimeField from './DatetimeField'
import DateField from './DateField'
import RadioField from './RadioField'
import SelectedField from './SelectedField'
import TextField from './TextField'
// import UrmptreeField from './UrmptreeField'
import mixin from './mixin'

export default {
  name: 'Factory',
  props: {
    ...mixin.props
  },
  data: () => ({
    mapping: new Map([
      ['TEXT', TextField],
      ['DATE', DateField],
      ['DATETIME', DatetimeField],
      ['CHECKBOX', CheckboxField],
      ['RADIO', RadioField],
      ['SELECTED', SelectedField]
      // ['URMPTREE', UrmptreeField]
    ])
  }),
  render (h) {
    const { field, formItemProps, mapping } = this
    const { displayType = 'TEXT' } = field
    const Field = mapping.get(displayType)
    console.log(displayType)
    return h(Field, {
      props: {
        field,
        formItemProps
      }
    })
  }
}
</script>
