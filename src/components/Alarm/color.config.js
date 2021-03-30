export const levelColorMapping = new Map([
  [0, '#ff0202'], // 1级告警
  [1, '#f68808'], // 2级告警
  [2, '#ffdb00'], // 3级告警
  [3, '#2d97ff'], // 4级告警
  [4, '#06c357'] // 5级告警
])

export const pureLevelColorMapping = new Map([
  [0, '#06c357'], // 无告警（与5级告警同色，意为正常）
  [1, '#ff0202'], // 1级告警
  [2, '#f68808'], // 2级告警
  [3, '#ffdb00'], // 3级告警
  [4, '#2d97ff'], // 4级告警
  [5, '#06c357'] // 5级告警
])
