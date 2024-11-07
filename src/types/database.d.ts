declare namespace IDatabase {
  export interface plugin {
    id: string
    name: string
    content: string
    version: string
    enable: boolean
    url?: string
  }
}
