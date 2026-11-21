export const solarHolidays = [
  { name: '元旦', date: '-01-01', type: 'solar' },
  { name: '情人节', date: '-02-14', type: 'solar' },
  { name: '妇女节', date: '-03-08', type: 'solar' },
  { name: '劳动节', date: '-05-01', type: 'solar' },
  { name: '青年节', date: '-05-04', type: 'solar' },
  { name: '儿童节', date: '-06-01', type: 'solar' },
  { name: '建党节', date: '-07-01', type: 'solar' },
  { name: '建军节', date: '-08-01', type: 'solar' },
  { name: '教师节', date: '-09-10', type: 'solar' },
  { name: '国庆节', date: '-10-01', type: 'solar' },
  { name: '万圣节', date: '-10-31', type: 'solar' },
  { name: '感恩节', date: 'thursday-11-4', type: 'solar' },
  { name: '圣诞节', date: '-12-25', type: 'solar' }
]

export const lunarHolidays = [
  { name: '春节', month: 1, day: 1, type: 'lunar' },
  { name: '元宵节', month: 1, day: 15, type: 'lunar' },
  { name: '龙抬头', month: 2, day: 2, type: 'lunar' },
  { name: '清明节', month: 3, day: 4, type: 'lunar' },
  { name: '端午节', month: 5, day: 5, type: 'lunar' },
  { name: '七夕节', month: 7, day: 7, type: 'lunar' },
  { name: '中元节', month: 7, day: 15, type: 'lunar' },
  { name: '中秋节', month: 8, day: 15, type: 'lunar' },
  { name: '重阳节', month: 9, day: 9, type: 'lunar' },
  { name: '腊八节', month: 12, day: 8, type: 'lunar' }
]

function solarToLunar(year, month, day) {
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
  ]
  
  const solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const Animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  
  let i, leap = 0, temp = 0
  const baseYear = 1900
  const baseMonth = 1
  const baseDay = 31
  
  if ((year < 1900) || (year > 2100)) {
    return null
  }
  
  if (year == 1900 && month == 1 && day < 31) {
    return null
  }
  
  const offset = (year - 1900) * 12 + month - 1
  
  for (i = 1900; i < year || (i == year && temp < month); i++) {
    leap = (lunarInfo[i - 1900] & 0xf)
    temp += (leap ? 13 : 12)
  }
  
  temp -= leap
  
  if (month > leap && leap != 0) {
    offset++
  }
  
  const lunarYearInfo = lunarInfo[year - 1900]
  leap = lunarYearInfo & 0xf
  const isLeapMonth = (leap != 0 && offset == (year - 1900) * 12 + leap - 1)
  
  let lunarMonth = ((lunarYearInfo >> 4) & 0x1f)
  let lunarDay = 0
  
  for (i = 0; i < offset - (year - 1900) * 12; i++) {
    lunarMonth = ((lunarYearInfo >> (4 + i)) & 0x1f)
  }
  
  const lunarMonths = [0, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30]
  let days = 0
  
  for (i = 1; i < month; i++) {
    days += (i == 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) ? 29 : solarMonth[i - 1]
  }
  
  days += day
  
  let j = 1900
  let k = 1
  let l = 31
  
  while (days > 0) {
    const y = lunarInfo[j - 1900]
    const lm = (y >> 4) & 0x1f
    const leapMonth = y & 0xf
    
    for (let m = 1; m <= (leapMonth ? 13 : 12); m++) {
      const dm = lunarMonths[m == leapMonth ? lm : ((y >> (4 + ((m > leapMonth ? m - 1 : m))) & 0x1f)]
      
      if (days > dm) {
        days -= dm
      } else {
        lunarYear = j
        lunarMonth = m
        lunarDay = days
        days = 0
        break
      }
    }
    
    if (days > 0) {
      j++
    }
  }
  
  return { year: j, month: lunarMonth, day: lunarDay, isLeapMonth }
}

function getLunarDate(year, month, day) {
  try {
    const result = solarToLunar(year, month, day)
    if (!result) return null
    
    const lunarYear = result.year
    const lunarMonth = result.month
    const lunarDay = result.day
    
    const ganIndex = (lunarYear - 4) % 10
    const zhiIndex = (lunarYear - 4) % 12
    
    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      yearGanZhi: `${['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][ganIndex]}${['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][zhiIndex]}年`,
      animal: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'][zhiIndex],
      isLeapMonth: result.isLeapMonth
    }
  } catch (e) {
    return null
  }
}

export function getUpcomingHolidays(days = 90) {
  const today = new Date()
  const holidays = []
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    const solarHoliday = solarHolidays.find(h => h.date === `-${month}-${day}`)
    if (solarHoliday) {
      holidays.push({
        ...solarHoliday,
        date: dateStr,
        daysUntil: i,
        isLunar: false
      })
      continue
    }
    
    const lunarDate = getLunarDate(year, parseInt(month), parseInt(day))
    if (lunarDate) {
      const lunarHoliday = lunarHolidays.find(h => 
        h.month === lunarDate.month && h.day === lunarDate.day
      )
      if (lunarHoliday) {
        holidays.push({
          ...lunarHoliday,
          date: dateStr,
          daysUntil: i,
          isLunar: true
        })
      }
    }
  }
  
  return holidays.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 5)
}