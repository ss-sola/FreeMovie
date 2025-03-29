import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.freemovie',
  appName: 'FreeMovie',
  webDir: 'dist',
  loggingBehavior: 'none',
  server: {
    hostname: 'app.metasola.cn',
  }
}

export default config
