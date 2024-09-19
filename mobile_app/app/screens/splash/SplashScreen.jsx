import React, { useEffect } from "react";
import { View } from "react-native";

import DisplayImage from "../../components/DisplayImage";

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    const fakeAsync = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => clearTimeout(fakeAsync);
  }, [navigation]);

  return (
    <View>
      <DisplayImage/>
    </View>
  );
}