import GRouter from '@/router/routes'
import { useSearchStore } from '@/stores/searchStore'
import { doSearch } from '@/service/movie'
function search() {
  GRouter.toSearchRes()
  doSearch()
}

export { search }
