import { getFplData } from "@/app/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function HomeScreen(){
    const [players,setPlayers]=useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
          try {
            const data = await getFplData();
            const elements = Array.isArray(data?.elements) ? data.elements.slice(0,5) : [];
            setPlayers(elements);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
        loadData();
      }, []);

    if (loading) return <ActivityIndicator size="large" />;

    return(
        <View className="flex-1 justify-center items-center ">
            <FlatList
              data={players}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <View >
                <Text>{item.web_name}</Text>
                {item.opta_code ? (
                  <Image
                    source={{ uri: `https://resources.premierleague.com/premierleague/photos/players/110x140/${item.opta_code}.png` }}
                    style={{ width: 110, height: 140 }}
                  />
                ) : (
                  <Text>No Image</Text>
                )}
                </View>
              )}
            />
        </View>
    )}