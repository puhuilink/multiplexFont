/* eslint-disable */

const compose = ({ selectedKpi, selectedInstance }) => {
  const res = []
  selectedInstance.forEach(instance => {
    selectedKpi.forEach(kpi => {
      res.push({
        kpi_code: kpi,
        ci_id: instance
      })
    })
  })
  return res
}

const template = `t_kpi_current(where: {
  _and: {kpi_code: {_eq: "2008"}, ci_id: {_eq: "123069817938744"}}}) {
  kpi_value_num
}`

const query = ({ kpi_code, ci_id }) => (
  `data: t_kpi_current(where: {
    _and: {
      kpi_code: {_eq: ${kpi_code}},
      ci_id: {_eq: "${ci_id}"}}
  }) {
    value: kpi_value_num
  }`
)

const queryList = (data) => {
  const list = compose(data)
  const res = `{ ${list.map(query)} }`
  return res
}

// const dataList = [
//   {
//     kpi_code: 2008,
//     ci_id: 123069817938744
//   }
// ]

// queryList(dataList)
export {
  queryList
}