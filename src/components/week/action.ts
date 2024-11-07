import { useWeekStore } from '@/stores/weekStore'
const weekData = useWeekStore().weekData

const chooseWeek = function (index: number) {
  for (var i = 0; i < weekData.length; i++) {
    weekData[i].active = false
  }
  weekData[index].active = true
}

export { chooseWeek }
