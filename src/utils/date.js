export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export function formatDateStr(dateStr) {
  const date = new Date(dateStr)
  return formatDate(date, 'YYYY-MM-DD')
}

export function formatDayNum(dateStr) {
  const date = new Date(dateStr)
  return date.getDate()
}

export function formatMonth(dateStr) {
  const date = new Date(dateStr)
  return date.getMonth() + 1
}

export function formatMonthShort(date) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const d = new Date(date)
  return months[d.getMonth()]
}

export function formatYear(dateStr) {
  const date = new Date(dateStr)
  return date.getFullYear()
}

export function formatFullMonth(date) {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

export function getDayDiff(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

export function isToday(dateStr) {
  const today = new Date()
  const date = new Date(dateStr)
  return formatDate(today) === formatDate(date)
}

export function getWeekdays() {
  return ['日', '一', '二', '三', '四', '五', '六']
}

export function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  
  const startDay = firstDay.getDay()
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasDiary: false,
      date: new Date(year, month - 1, prevMonthLastDay - i)
    })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: false,
      hasDiary: false,
      date
    })
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasDiary: false,
      date: new Date(year, month + 1, i)
    })
  }
  
  return days
}

export function getToday() {
  return new Date()
}

export function getTodayStr() {
  return formatDate(new Date())
}

export function formatDateTime(dateStr) {
  const date = new Date(dateStr)
  return formatDate(date, 'YYYY-MM-DD HH:mm')
}

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}