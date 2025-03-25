declare namespace IPlugin {
  /**用户自定义输入 */
  interface IUserVariable {
    /** 键 */
    key: string
    /** 名称 */
    name?: string
    /** 提示文案 */
    hint?: string
  }
  export interface ISearchResult {
    isEnd?: boolean
    data: IMovie.IMovieBase[]
  }

  export interface IMoiveSourceResult {
    headers?: Record<string, string>
    /** 播放地址 */
    url?: string
    type?: string
    /** UA */
    userAgent?: string
    /**m3u8内容 */
    m3u8Content?: string
  }
  interface IPluginDefine {
    id: string
    /** 来源名 */
    name: string
    /** 插件源地址 */
    from: string
    /** 插件版本 */
    version?: string
    /** 远程更新的url */
    srcUrl?: string
    /** 插件作者 */
    author?: string
    /** 用户自定义输入 */
    userVariables?: IUserVariable[]
    initRotationData?: () => Promise<IMovie.IMovieBase[]>
    initWeekData?: () => Promise<IMovie.IMovieBase[][]>
    /** 获取详细信息 */
    getDetailData: (movieItem: IMovie.IMovieBase) => Promise<IMovie.IMovieItem>
    /**搜索 */
    search?: (query: string, page?: number) => Promise<ISearchResult>
    /**播放 */
    play: (url: string, movieItem: IMovie.IMovieSource) => Promise<IMoiveSourceResult>
  }
  export type pluginMoudleKey = keyof IPlugin.IPluginModule
  interface IPluginModule extends IPluginDefine {
    enable: boolean
    otherEnable: []
  }
}
