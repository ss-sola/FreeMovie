declare namespace IEnvironment {
  export interface Rotation {
    /**图片个数 */
    imgLen: number
    /**半径 */
    radius: number
    /**旋转速度 */
    speed: number
    /**开始角度 */
    srartRightDeg: number

    tX: number
    tY: number
    /**x移动距离 */
    desX: number
    /**y移动距离 */
    desY: number
    /**当前角度 */
    deg: number
    /**请求帧 */
    count: number
    /**容器 */
    divBody: HTMLElement
    outDom: HTMLElement
    spinDom: HTMLElement
    /**卡片数组 */
    aImg: HTMLDivElement[]
  }
  export interface Week {
    week: string
    dataList: IMovie.IMovieBase[]
    active: boolean
  }
  export interface Config {
    InfoUrl: string
    IVersionName: string
    Database: string
    DatabaseVersion: number
    Enable: number
    Disable: number
    pluginModules: {
      http: typeof CapacitorHttp
      CryptoJS: typeof CryptoJS
      analysis: function
      proxyImg: function
    }
    TableName: {
      Plugin: string
    }
    errCatch: (e: any) => void
    IPlayStatus: {
      Getting: string
      Waiting: string
      Playing: string
      Pause: string
      ErrorGet: string
      ErrorPlay: string
    }
    safeWindow: Window & typeof globalThis
    baseDirectory: Directory.External
    basePath: string
  }
  export type Toast = Promises<void>

  export interface AndroidFullScreen {
    isImmersiveModeSupported: boolean
    isStickyImmersiveModeSupported: boolean
    isStickyModeSupported: boolean
    isImmersiveStickyModeSupported: boolean
    immersiveMode: () => void
    immersiveStickyMode: () => void
    stickyMode: () => void
    immersiveStickyModeWithDecorations: () => void
    showSystemUI: () => void
  }
}
