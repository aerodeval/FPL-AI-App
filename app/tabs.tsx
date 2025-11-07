import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeaguePlayers from "./screens/LeaguePlayers/[teamId]";
import AI from "./screens/Tabs/AI";
import Leagues from "./screens/Tabs/Leagues";
import News from "./screens/Tabs/News";
import Squad from "./screens/Tabs/Squad";
import TeamPlayers from "./screens/TeamPlayers/[teamPlayers]";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SquadStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SquadRoot" component={Squad} />
      <Stack.Screen name="TeamPlayers" component={TeamPlayers} />
    </Stack.Navigator>
  );
}

function LeaguesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeaguesRoot" component={Leagues} />
      <Stack.Screen name="LeaguePlayers" component={LeaguePlayers} />
      <Stack.Screen name="TeamPlayers" component={TeamPlayers} />
    </Stack.Navigator>
  );
}

export default function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22c55e",
        tabBarStyle: { backgroundColor: "#0f172a", borderTopColor: "#1f2937", height:60,  },
      }}
      initialRouteName="Squad"
    >
      <Tab.Screen
 
        name="Squad"
        component={SquadStack}
        options={{
          title: "My Team",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
            
          ),
        }}
      />
      <Tab.Screen
        name="Leagues"
        component={LeaguesStack}
        options={{
          title: "Leagues",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AI}
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


