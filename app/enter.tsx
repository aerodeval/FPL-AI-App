import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTeamStore } from "./store/useTeam";

export default function EnterScreen() {
  const { setTeamId } = useTeamStore();
  const [value, setValue] = useState("");

  const onContinue = () => {
    const normalized = value.trim();
    if (!normalized) return;
    setTeamId(normalized);
    router.replace("/tabs");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 px-5">
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-white text-2xl font-semibold">Enter Team ID</Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="e.g. 1234567"
          keyboardType="number-pad"
          placeholderTextColor="#9CA3AF"
          className="w-full border border-slate-600 rounded-md px-4 py-3 text-white"
        />
        <TouchableOpacity
          onPress={onContinue}
          className="mt-2 bg-emerald-500 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


