export const solarTerms = [
  { name: '小寒', date: '-01-05', description: '天气开始寒冷' },
  { name: '大寒', date: '-01-20', description: '一年中最冷的时候' },
  { name: '立春', date: '-02-04', description: '春天开始' },
  { name: '雨水', date: '-02-19', description: '降雨增多' },
  { name: '惊蛰', date: '-03-06', description: '春雷惊醒蛰居动物' },
  { name: '春分', date: '-03-21', description: '昼夜平分' },
  { name: '清明', date: '-04-05', description: '天气晴朗，草木繁茂' },
  { name: '谷雨', date: '-04-20', description: '雨水滋润谷物生长' },
  { name: '立夏', date: '-05-06', description: '夏天开始' },
  { name: '小满', date: '-05-21', description: '麦类作物饱满' },
  { name: '芒种', date: '-06-06', description: '麦类作物成熟' },
  { name: '夏至', date: '-06-22', description: '白天最长' },
  { name: '小暑', date: '-07-07', description: '天气开始炎热' },
  { name: '大暑', date: '-07-23', description: '一年中最热的时候' },
  { name: '立秋', date: '-08-08', description: '秋天开始' },
  { name: '处暑', date: '-08-23', description: '炎热天气结束' },
  { name: '白露', date: '-09-08', description: '露水变白' },
  { name: '秋分', date: '-09-23', description: '昼夜平分' },
  { name: '寒露', date: '-10-08', description: '露水变冷' },
  { name: '霜降', date: '-10-24', description: '开始降霜' },
  { name: '立冬', date: '-11-08', description: '冬天开始' },
  { name: '小雪', date: '-11-22', description: '开始下雪' },
  { name: '大雪', date: '-12-07', description: '雪量增多' },
  { name: '冬至', date: '-12-22', description: '白天最短' }
]

export function getCurrentSolarTerm(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const todayStr = `-${month}-${day}`
  
  const todayTerm = solarTerms.find(term => term.date === todayStr)
  if (todayTerm) {
    return { ...todayTerm, isToday: true }
  }
  
  const prevTerm = [...solarTerms].reverse().find(term => {
    const termDate = new Date(`${year}${term.date}`)
    return termDate <= date
  })
  
  const nextTerm = solarTerms.find(term => {
    const termDate = new Date(`${year}${term.date}`)
    return termDate > date
  })
  
  return {
    prev: prevTerm ? { ...prevTerm, date: `${year}${prevTerm.date}` } : null,
    next: nextTerm ? { ...nextTerm, date: `${year}${nextTerm.date}` } : null
  }
}