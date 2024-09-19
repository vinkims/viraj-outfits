import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import LoggerUtil from "../utils/LoggerUtil";
import StorageUtil from "../utils/StorageUtil";

const DisplayImage = () => {
  const [ imageUrl, setImageUrl ] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const storedUrl = await StorageUtil.getLogoUrl();
        if (storedUrl) {
          setImageUrl(storedUrl);
        }
      } catch (error) {
        LoggerUtil.logError("Error fetching image URL", error);
      }
    }

    fetchImageUrl();
  }, []);

  const getDefaultImage = () => {
    // return require('../assets/images/splash.jpeg');
    return require('../assets/images/splash.png');
  }

  return (
    <View>
      {
        imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Image source={getDefaultImage()} style={styles.image} />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  image: {
    height: "100%",
    resizeMode: "cover",
    width: "100%"
  }
});

export default DisplayImage;