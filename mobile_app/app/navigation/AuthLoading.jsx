import React, { useEffect, useState } from "react";
import { View } from "react-native";

import Loading from "../components/Loading";
import StorageUtil from "../utils/StorageUtil";

export default function AuthLoading({ navigation }) {
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      const token = await StorageUtil.getToken();
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Splash'}]
        })
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}]
        })
      }
    }

    checkToken();
  }, []);

  if (loading) {
    return (<Loading/>);
  }

  return (
    <View/>
  );
}