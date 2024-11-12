declare namespace IMovie {
  /**总集数 */
  export interface ITotalItem {
    html: string
    value: string
    /** 其他可以被序列化的信息 */
    [k: string]: any
  }
  export interface ILineItemValue {
    default?: boolean
    html: string
    value: string
    total: IMovie.ITotalItem[]
  }
  /**线路 */
  export interface ILineItem {
    [k: string]: IMovie.ILineItemValue
  }
  export interface IMovieBase {
    /** 视频在平台的唯一编号 */
    id: string
    /** 平台 */
    platform: string
    /** 标题 */
    title: string
    /** 封面 */
    img: string
    /**状态 */
    tag?: string
    /**插件id */
    pluginId: string
    /** 其他可以被序列化的信息 */
    [k: string]: any
  }
  export interface IMovieItem extends IMovie.IMovieBase {
    /**地区 */
    region?: string
    /**简介 */
    desc?: string
    /** 导演 */
    director?: string
    /** 主演 */
    actor?: string
    /**更新时间 */
    updateTime?: string
    /**线路 */
    line?: IMovie.ILineItem
    /**扩展展示信息 */
    labelMap?: {
      [k: string]: string
    }
  }

  /**视频播放类型 */
  export type IMovieType = 'mp4' | 'm3u8' | 'flv' | ''

  // 片源定义
  export interface IMovieSource extends IMovie.IMovieItem {
    /** 播放地址 */
    url?: string
    /** 视频播放类型 */
    type?: IMovie.IMovieType
    /**当前线路 */
    activeLine?: string
    /**当前播放第几集 */
    activeNumber?: string
    /**播放状态 */
    playStatus?: string
  }
}
