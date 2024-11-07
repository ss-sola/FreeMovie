declare namespace ISearch {
  export interface ISearchResult {
    name: string
    pluginId: string
    count: number
    datas: IMovie.IMovieItem[]
    active: boolean
  }
}
