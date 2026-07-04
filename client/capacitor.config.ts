import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.musicwave.app",
  appName: "MusicWave",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
