import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { ImageWithFallbabck } from "../../components/ImageWithFallback";

type UpcomingMovie = {
  id: number;
  title: string;
  poster_path: string;
};
export default function HomeScreen() {
  const [isLoading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [movies, setMovies] = useState<UpcomingMovie[]>([]);
  async function fetchUpcomingMovies() {
    if (isLoading || (totalResults <= movies.length && totalResults !== 0)) {
      return;
    }
    try {
      const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
      const url = `${BASE_URL}/movie/upcoming?language=en-US&page=${pageNumber}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
        },
      };

      setLoading(true);
      const fetchUserGroupsApi = await axios.get(url, options);

      if (fetchUserGroupsApi.status === 200) {
        setMovies((prev) => [...prev, ...fetchUserGroupsApi.data?.results]);
        if (fetchUserGroupsApi?.data?.total_pages > pageNumber) {
          setPageNumber((prev) => prev + 1);
        }
        setTotalResults(fetchUserGroupsApi.data?.total_results || 0);
        setLoading(false);
      }
    } catch (error: any) {
      console.log("Error fetching user groups:", error.message);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "failed to get moview",
      });
    }
  }
  useEffect(() => {
    fetchUpcomingMovies();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item?.id.toString()}
        onEndReached={() => {
          if (!isLoading) {
            fetchUpcomingMovies();
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              // Handle movie item press
              console.log("Movie pressed:", item.title);
              router.push({
                pathname: "/(movie)/[id]",
                params: item,
              });
            }}
            style={styles.stepContainer}
          >
            <ImageWithFallbabck
              name={item?.title || ""}
              source={item?.poster_path || ""}
              imageStyle={{ height: 200, width: "100%", borderRadius: 8 }}
            />
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                {item?.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 18, color: "#000" }}>No movies found</Text>
          </View>
        }
        ListFooterComponent={() =>
          isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "absolute",
    bottom: 0,
    margin: 15,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    marginHorizontal: 15,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
