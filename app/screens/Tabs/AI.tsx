import { FplService } from "@/app/api/fplService";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";

export default function AI() {
  const { data: bootstrapData, isLoading, error } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => FplService.getBootstrapData(),
    staleTime: 1000 * 60 * 60,
  });

  const elements = bootstrapData?.elements ?? [];

  const topIn = [...elements]
    .sort((a, b) => (b.transfers_in_event ?? 0) - (a.transfers_in_event ?? 0))
    .slice(0, 8);
  const topOut = [...elements]
    .sort((a, b) => (b.transfers_out_event ?? 0) - (a.transfers_out_event ?? 0))
    .slice(0, 8);

  const pairedSwaps = topIn.map((inPlayer, idx) => {
    const outPlayer = topOut[idx];
    return {
      in: {
        name: inPlayer?.web_name,
        photo: inPlayer?.photo,
        count: inPlayer?.transfers_in_event ?? 0,
      },
      out: {
        name: outPlayer?.web_name,
        photo: outPlayer?.photo,
        count: outPlayer?.transfers_out_event ?? 0,
      },
    };
  });

  const imageUriFor = (photo?: string) => {
    if (!photo) {
      return "https://resources.premierleague.com/premierleague25/photos/players/110x140/placeholder.png";
    }
    return `https://resources.premierleague.com/premierleague25/photos/players/110x140/${photo.replace(".jpg", ".png")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }} style={{ width: "100%" }}>
        <Text className="text-white font-bold mb-2">Popular swaps this gameweek</Text>
        <View className="px-3 py-4 bg-[#FA9AFF33] rounded-xl gap-8 w-full">
          <View className="flex-row items-center gap-2">
            <Ionicons name="swap-horizontal-outline" size={18} color="#ffb6e6" />
            <Text className="text-[#ffb6e6] font-semibold">Top community transfers</Text>
          </View>

          {isLoading ? (
            <View className="items-center justify-center">
              <ActivityIndicator size="small" color="#ffb6e6" />
              <Text className="text-[#d4a9e0] mt-2">Loading popular transfers…</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center">
              <Text className="text-red-400">Failed to load data</Text>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {pairedSwaps.map((swap, idx) => (
                  <View
                    key={`swap-${idx}`}
                    className="bg-white/10 rounded-xl px-4 py-4 mr-3"
                    style={{ width: 300 }}
                  >
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="items-center">
                        <Image
                          source={{ uri: imageUriFor(swap.out.photo) }}
                          style={{ width: 70, height: 90, borderRadius: 8 }}
                          resizeMode="cover"
                        />
                        <Text className="text-white mt-2" numberOfLines={1}>
                          <Text className="text-red-400 font-semibold">Out</Text>: {swap.out.name || "N/A"}
                        </Text>
                      </View>

                      <SvgUri
                        width={22}
                        height={22}
                        uri={Asset.fromModule(require("../../../assets/images/swap.svg")).uri}
                      />

                      <View className="items-center">
                        <Image
                          source={{ uri: imageUriFor(swap.in.photo) }}
                          style={{ width: 70, height: 90, borderRadius: 8 }}
                          resizeMode="cover"
                        />
                        <Text className="text-white mt-2" numberOfLines={1}>
                          <Text className="text-green-400 font-semibold">In</Text>: {swap.in.name || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-center gap-6">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="arrow-down-outline" size={14} color="#e60023" />
                        <Text className="text-white">{swap.out.count?.toLocaleString?.() ?? swap.out.count}</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="arrow-up-outline" size={14} color="#34a853" />
                        <Text className="text-white">{swap.in.count?.toLocaleString?.() ?? swap.in.count}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View className="flex-row self-center mt-2 gap-1">
                {pairedSwaps.map((_, i) => (
                  <View key={`dot-${i}`} className="w-2 h-2 rounded-full bg-white/20" />
                ))}
              </View>
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


