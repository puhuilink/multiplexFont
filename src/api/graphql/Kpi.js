import gql from 'graphql-tag'

// const kpiFieldMap = new Map([
//   ['', '']
// ])

// FIMXE: 全量查询存在性能问题，考虑改为动态生成语句
export const queryKpiList = gql`query instanceList($where: ngecc_instance_values_bool_exp! = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_instance_values_order_by!]) {
  pagination: ngecc_instance_values_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_instance_values(offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    version_s
    valuelabel_s
    valuecode_s
    updatetime_t
    unit_s
    type_s
    triggertime_s
    state_s
    serialnumber_s
    seq
    saveinterval_s
    rid
    rfidlabellocation_s
    rfidcode_s
    resultitem_s
    pointedtokqi_cal_layer_top_s
    pointedtokqi_cal_layer_s
    pointedtokqi_cal_layer_1_s
    parentname_s
    osversion_s
    order_i
    nodetype_s
    name_s
    monprotocal_s
    monport_s
    monlistenip_s
    model_s
    locationbelongstoinspectionpoint_s
    locatedroom_s
    locatedrack_s
    locatedinmachineroom_s
    label_s
    kpicode_s
    keepperiod_s
    itowner_s
    ispageadd_s
    isnumber_b
    iskpi_b
    isaggregate_s
    ip_s
    installonserver_s
    inspectionkpi_s
    inspection_inputtype_s
    inspecationlocation_s
    id_s
    icon_s
    hostname_s
    granularityunit_s
    granularity_s
    expression_s
    environment_s
    enable_b
    domain_s
    did
    description_s
    description_1_s
    depth_i
    callkpiperiod_s
    brand_s
    belongstovmhost_s
    belongstophy_s
    belongstobiz_s
    basekpicode_s
  }
}`
