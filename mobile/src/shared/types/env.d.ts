declare module "react-native-config" {
  export interface NativeConfig {
    ENV: "development" | "staging" | "production";
    API_URL: string;
    APP_NAME: string;
    BUNDLE_ID: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
