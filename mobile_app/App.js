import React from "react";
import { NativeBaseProvider } from "native-base";

import { LanguageProvider } from "./app/utils/language/LanguageProvider";
import { NavigationContainer } from "@react-navigation/native";
import NavigationService from "./app/services/NavigationService";
import StackNavigator from "./app/navigation/StackNavigator";
import { ThemeProvider } from "./app/theme/ThemeContext";

export default function App() {

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NativeBaseProvider>
          <NavigationContainer
            ref={(navRef) => NavigationService.setRootNavigator(navRef)}
          >
            <StackNavigator/>
          </NavigationContainer>
        </NativeBaseProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}