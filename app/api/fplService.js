import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { fetchJson } from './fetchJson';

// Production API URL - Replace with your Render URL after deployment
// Example: 'https://your-app-name.onrender.com/api'
const PRODUCTION_API_URL = null; // Set this to your Render URL, e.g., 'https://barber-api.onrender.com/api'

// Use appropriate URL based on platform
// Automatically detects the correct hostname for both emulators and physical devices
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

let commonUrl = getApiUrl();
export const FplService = {

    getBootstrapData: async () =>{
        return fetchJson(`${commonUrl}/bootstrap`)
    },

    getFixtureData: async () =>{
         return fetchJson(`${commonUrl}/fixtures`)
    },

    getEntryData: async (userId) =>{
        return fetchJson(`${commonUrl}/entry/${userId}`)
   },

    getTeamData: async (leagueId)=>{
    return fetchJson(`${commonUrl}/leagues-classic/${leagueId}/standings`)
   }
,
   getTeamPlayers: async (team_id,gw_id)=>{
    return fetchJson(`${commonUrl}/entry/${team_id}/event/${gw_id}/picks`)
   },
   getPlayerTransfers: async (team_id)=>{
    return fetchJson(`${commonUrl}/entry/${team_id}/transfers/`)
   }

};