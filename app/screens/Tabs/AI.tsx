import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AI() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: "center", justifyContent: "center", flexGrow: 1 }} style={{ width: "100%" }}>
        <Text className="text-white text-xl font-semibold mb-4 text-center">AI Recommendations</Text>
        <Text className="text-gray-300 text-center">Coming soon...</Text>
      </ScrollView>
    </SafeAreaView>
  );
}


