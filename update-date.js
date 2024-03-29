// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require("fs")
const jst = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
fs.writeFile(".env", 'VITE_BUILD_DATE=' + date_to_yyyymmddhhmmss(new Date(jst)), (err) => {
  if (err) throw err
})

function date_to_yyyymmddhhmmss(date) {
  const yyyy = date.getFullYear()
  const mm = ('0' + (date.getMonth() + 1)).slice(-2)
  const dd = ('0' + date.getDate()).slice(-2)
  const hh = ('0' + date.getHours()).slice(-2)
  const min = ('0' + date.getMinutes()).slice(-2)
  return yyyy + '.' +  mm + '.'  +  dd + '.'  + hh + '.'  + min
}