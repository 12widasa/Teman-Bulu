import moment from "moment";
const dateFormat = (value) => {
  return moment(value).format("DD MMM YYYY")
}
const dateFormatWithTime = (value) => {
  return moment(value).format("DD MMM YYYY HH:mm:ss")
}

export { dateFormat, dateFormatWithTime }