import { useHistoryStore } from '@/stores/historyStore'

function clearHistory() {
  let historyData = useHistoryStore().playHistory
  historyData.length = 0
  console.log(historyData)
  localStorage.removeItem('solamovie-history')
}

export { clearHistory }
