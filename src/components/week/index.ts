import { useWeekStore } from '@/stores/weekStore'
import { initWeekData } from '@/service/week'

const init = async () => {
  const weekData = useWeekStore().weekData
  const today = new Date().getDay()
  const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  for (var i = 0; i < week.length; i++) {
    var obj = {
      week: week[i],
      dataList: [],
      active: today == (i + 1) % 7 ? true : false
    }
    weekData.push(obj)
  }
  const res = await initWeekData()
}

export { init }
