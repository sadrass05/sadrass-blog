export const historyEvents = {
  '01-01': [
    { year: 1912, title: '中华民国成立', description: '孙中山在南京宣誓就任中华民国临时大总统' },
    { year: 1949, title: '联合国成立', description: '联合国正式成立，总部设在美国纽约' }
  ],
  '01-15': [
    { year: 2001, title: '维基百科上线', description: '全球最大的免费在线百科全书开始运营' }
  ],
  '03-08': [
    { year: 1910, title: '国际妇女节确立', description: '在丹麦哥本哈根召开的国际社会主义妇女大会上确立' }
  ],
  '04-12': [
    { year: 1961, title: '人类首次进入太空', description: '苏联宇航员尤里·加加林乘坐东方1号进入太空' }
  ],
  '04-19': [
    { year: 1775, title: '列克星敦枪声', description: '美国独立战争爆发' },
    { year: 1995, title: '俄克拉荷马城爆炸案', description: '美国历史上最严重的恐怖袭击之一' }
  ],
  '05-04': [
    { year: 1919, title: '五四运动', description: '中国近代史上具有重要意义的爱国运动' }
  ],
  '06-06': [
    { year: 1944, title: '诺曼底登陆', description: '盟军在法国诺曼底海滩登陆，二战重要转折点' }
  ],
  '07-04': [
    { year: 1776, title: '美国独立', description: '美国宣布脱离英国独立' }
  ],
  '07-20': [
    { year: 1969, title: '人类首次登月', description: '阿波罗11号成功登月，阿姆斯特朗成为第一个踏上月球的人' }
  ],
  '08-15': [
    { year: 1945, title: '日本投降', description: '第二次世界大战结束' }
  ],
  '10-01': [
    { year: 1949, title: '中华人民共和国成立', description: '毛泽东在北京天安门城楼宣告新中国成立' }
  ],
  '10-24': [
    { year: 1945, title: '联合国成立', description: '联合国宪章正式生效' }
  ],
  '12-07': [
    { year: 1941, title: '珍珠港事件', description: '日本偷袭美国珍珠港，太平洋战争爆发' }
  ],
  '12-25': [
    { year: 1991, title: '苏联解体', description: '苏联正式解体，冷战结束' }
  ]
}

export function getTodayHistoryEvents(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const key = `${month}-${day}`
  
  return historyEvents[key] || []
}