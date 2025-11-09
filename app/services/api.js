import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Production API URL - Replace with your Render URL after deployment
// Example: 'https://your-app-name.onrender.com/api'
const PRODUCTION_API_URL = 'https://fpl-ai-app.onrender.com/api'; // Production API URL

const getApiUrl = () => {
  // If production URL is set, use it for all platforms
  if (PRODUCTION_API_URL) {
    return PRODUCTION_API_URL;
  }

  // Development mode - use local server
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  } else {
    // Get the debugger host from Expo's manifest
    // This automatically works for both emulators and physical devices
    const debuggerHost = Constants.manifest?.debuggerHost?.split(':')[0] ||
                        Constants.manifest2?.extra?.expoGo?.debuggerHost?.split(':')[0] ||
                        Constants.expoConfig?.hostUri?.split(':')[0] ||
                        null;
    
    // If we have a debugger host (physical device or tunnel), use it
    if (debuggerHost && debuggerHost !== 'localhost') {
      return `http://${debuggerHost}:5000/api`;
    }
    
    // Fallback for emulators/simulators
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api'; // Android emulator
    } else {
      return 'http://localhost:5000/api'; // iOS simulator
    }
  }
};

export async function getFplData(){

    const response = await fetch(`${getApiUrl()}/fpl`);
    if(!response.ok){
        throw new Error("No Data Received, Server Issue")
    }
    
    return await response.json();
}