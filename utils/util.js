// 时间格式转换 yyyy/mm/dd
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatMonth(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  return [year, month].map(formatNumber).join('-')
}

// 两位数自动补零
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



// 计算变化多少天后的日期
function DateAddDay(d, days) {
  var d = new Date(d);
  return new Date(d.setDate(d.getDate() + days));
}
// 获得本周周日的日期
function FirstDayInThisWeek(d) {
  var d = new Date(d);
  return DateAddDay(d, 0 - d.getDay());
}

// 判断类型
function Type(obj) {
  var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
  return typeStr.substr(0, typeStr.length - 1).toLowerCase();
}

function toWeekDay(weekday) {
  return ["日", "一", "二", "三", "四", "五", "六"][weekday]
}

function toHours(timestamp) {
  return new Date(timestamp).getHours()
}

function toMinutes(timestamp) {
  return new Date(timestamp).getMinutes()
}

function toTimeStamp(year, month, day) {
  return Date.parse(`${year}/${month}/${day}`)
}

function toTimeStampMinutes(year, month, day, hours, minutes) {
  return Date.parse(`${year}/${month}/${day} ${hours}:${minutes}`)
}

function toTTime(date) {
  if (!(date instanceof Date))
    throw new Error('此数据不是对象')
  let [Year, Month, Day, Hours, Minutes, Seconds] = [date.getFullYear(), formatNumber(date.getMonth() + 1), formatNumber(date.getDate()),
    formatNumber(date.getHours()), formatNumber(date.getMinutes()), formatNumber(date.getSeconds())
  ]
  return `${Year}-${Month}-${Day}T${Hours}:${Minutes}:${Seconds}`
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatMonth: formatMonth,
  DateAddDay: DateAddDay,
  FirstDayInThisWeek: FirstDayInThisWeek,
  type: Type,
  addZero: formatNumber,
  toTimeStamp: toTimeStamp,
  toHours: toHours,
  toMinutes: toMinutes,
  toTimeStampMinutes: toTimeStampMinutes,
  toTTime: toTTime,
  toWeekDay: toWeekDay
}