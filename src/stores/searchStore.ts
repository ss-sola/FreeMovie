import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
  const searchResult = reactive([]) as ISearch.ISearchResult[]
  // searchResult.unshift({
  //   datas: [],
  //   active: true,
  //   name: '推荐',
  //   count: 0
  // })

  const searchContent = reactive({
    content: '',
    isShow: false
  })

  const clearSearchResult = () => {
    searchResult.splice(0, searchResult.length)
  }
  const showSelf = (index: number) => {
    for (let i = 0; i < searchResult.length; i++) {
      searchResult[i].active = index == i
    }
  }
  return {
    searchResult,
    searchContent,
    clearSearchResult,
    showSelf
  }
})
