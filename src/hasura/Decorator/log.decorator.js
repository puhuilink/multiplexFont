export const log = function (target, name, descriptor) {
  console.log(Date.now())
  console.log(
    target,
    name,
    descriptor
  )
}
