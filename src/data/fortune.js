const fortuneTypes = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

const fortuneDescriptions = {
  overall: ['运势平平', '小有起伏', '稳步上升', '运势不错', '大吉大利'],
  wealth: ['财运一般', '小有偏财', '财运亨通', '财源滚滚', '日进斗金'],
  love: ['感情平稳', '桃花初开', '爱情甜蜜', '缘分将至', '佳偶天成'],
  health: ['身体康健', '精力充沛', '活力四射', '容光焕发', '龙马精神']
}

function getZodiacSign(month, day) {
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 0
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 1
  if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return 2
  if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return 3
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 4
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 5
  if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return 6
  if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return 7
  if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return 8
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 9
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 10
  return 11
}

export function generateFortune(date = new Date()) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const zodiacIndex = getZodiacSign(month, day)
  
  const seed = (date.getFullYear() * 10000 + month * 100 + day) % 100
  
  const overall = Math.min(100, 40 + Math.floor((seed * 7) % 60))
  const wealth = Math.min(100, 30 + Math.floor((seed * 5) % 70))
  const love = Math.min(100, 35 + Math.floor((seed * 6) % 65))
  const health = Math.min(100, 50 + Math.floor((seed * 4) % 50))
  
  const getLevel = (value) => {
    if (value >= 80) return 4
    if (value >= 60) return 3
    if (value >= 40) return 2
    if (value >= 20) return 1
    return 0
  }
  
  return {
    zodiac: fortuneTypes[zodiacIndex],
    overall: {
      value: overall,
      description: fortuneDescriptions.overall[getLevel(overall)]
    },
    wealth: {
      value: wealth,
      description: fortuneDescriptions.wealth[getLevel(wealth)]
    },
    love: {
      value: love,
      description: fortuneDescriptions.love[getLevel(love)]
    },
    health: {
      value: health,
      description: fortuneDescriptions.health[getLevel(health)]
    }
  }
}