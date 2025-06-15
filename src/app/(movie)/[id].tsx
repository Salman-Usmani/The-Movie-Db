import { useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ImageWithFallbabck } from "../../components/ImageWithFallback";

const MovieDetails = () => {
  const { title, poster_path } = useLocalSearchParams();

  // Ensure title is a string
  const titleString = Array.isArray(title) ? title[0] : title;

  // Ensure poster_path is a string
  const posterPathString = Array.isArray(poster_path)
    ? poster_path[0]
    : poster_path;

  //   const { id, title, poster_path } = useSearchParams(); // get the dynamic route param "id"
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: title || "Details", // set the header title to the movie id
    });
  }, [title]);

  return (
    <SafeAreaView>
      <ImageWithFallbabck
        source={posterPathString}
        name={titleString || "Movie"}
        imageStyle={{ width: "100%", height: 200, borderRadius: 0 }}
      />
    </SafeAreaView>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({});
