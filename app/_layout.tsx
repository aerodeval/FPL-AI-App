import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 🔥 hides the top header/title bar for all screens
      }}
    />
  );
}
