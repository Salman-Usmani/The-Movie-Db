import React, { useState } from "react";
import { Image, ImageStyle, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";

type ImageType = {
  source?: string | undefined;
  name: string;
  imageStyle?: ImageStyle;
};

const CircleWithAtSign = ({ name, imageStyle }: ImageType) => (
  <View style={[styles().noAvatarView, imageStyle]}>
    <Text style={styles().textStyle}>{name[0] ? name[0] : null}</Text>
  </View>
);

export const ImageWithFallbabck = ({ source, name, imageStyle }: ImageType) => {
  const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;
  const TOKEN = process.env.EXPO_PUBLIC_ACCESS_TOKEN;

  const [error, setError] = useState(false);

  return source ? (
    error ? (
      <CircleWithAtSign name={name} imageStyle={imageStyle} />
    ) : (
      <Image
        source={{
          uri: IMAGE_URL + source,
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }}
        style={[styles().avatarStyle, imageStyle]}
        resizeMode="cover"
        resizeMethod="scale"
        onError={() => setError(true)}
      />
    )
  ) : (
    <CircleWithAtSign name={name} imageStyle={imageStyle} />
  );
};

const styles = (diameter: number = 100) =>
  StyleSheet.create({
    noAvatarView: {
      backgroundColor: Colors.dark.background,
      borderRadius: 10,
      width: diameter,
      height: diameter,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarStyle: {
      width: diameter,
      height: diameter,
      borderRadius: 10,
    },
    textStyle: {
      textTransform: "uppercase",
      color: Colors.dark.text,
      fontSize: diameter / 2,
    },
    imageContainer: {
      width: 130,
      height: 25,
      justifyContent: "center",
    },
  });
