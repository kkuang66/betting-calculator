import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.betting.calculator',
  appName: '下注计算器',
  webDir: 'src',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      quality: 80,
      allowEditing: false,
      resultType: 'uri'
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#667eea'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#667eea'
    }
  }
};

export default config;
