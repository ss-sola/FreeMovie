declare var IConfig: IEnvironment.Config
declare var Toast: IEnvironment.Toast
declare module '@capacitor/clipboard' {
  export const Clipboard: {
    write(options: { string: string; image?: string; url?: string; label?: string }): Promise<void>
    read(): Promise<{ value: string; type: string }>
  }
}
