export const filterAscription = (text) => {
  switch (text) {
    case 'MachineRoom-XM':
      return '厦门机房'
    case 'MachineRoom-BJ':
      return '北京机房'
    default:
      return text
  }
}
