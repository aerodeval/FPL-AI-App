import { SafeAreaView } from "react-native-safe-area-context";
import "../assets/global.css";
import LoginScreen from "./screens/Auth/LoginScreen";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <LoginScreen />
    </SafeAreaView>
  );
}

