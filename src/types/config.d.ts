declare var IConfig: IEnvironment.Config
declare var Toast: IEnvironment.Toast
declare var AndroidFullScreen: IEnvironment.AndroidFullScreen
declare module '@capacitor/clipboard' {
  export const Clipboard: {
    write(options: { string: string; image?: string; url?: string; label?: string }): Promise<void>
    read(): Promise<{ value: string; type: string }>
  }
}

interface VolumeControlPlugin {
  setVolume(volume: number): void;
  getVolume(): Promise<number>;
}
declare var cordova
declare var VolumeControl: VolumeControlPlugin;