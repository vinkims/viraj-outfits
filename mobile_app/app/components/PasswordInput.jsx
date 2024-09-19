import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { COLORS } from "../constants/theme";
import { useLanguage } from "../utils/language/LanguageProvider";
import { useTheme } from "../theme/ThemeContext";

export default function PasswordInput({ heading, password, showPassword, togglePasswordVisibility, setPassword, error, errorText, ...rest }) {
  const { theme } = useTheme();
  const { translate } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>{heading}</Text>
      <View style={[styles.inputContainer, {borderColor: error ? COLORS.red : COLORS.grey}]}>
        <TextInput
          secureTextEntry={!showPassword}
          style={styles.textInput}
          value={password}
          placeholder="****************"
          placeholderTextColor={COLORS.grey}
          onChangeText={(text) => setPassword(text)}
          {...rest}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Text style={[styles.toggleText, {color: theme.primaryColor}]}>{showPassword ? translate('hide') : translate('show')}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "90%"
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "bold"
  },
  headingText: {
    color:COLORS.black
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    marginTop: 5,
    width: "100%"
  },
  textInput: {
    color: COLORS.black,
    height: 50,
    width: "80%"
  },
  toggleText: {
    marginRight: 5
  }
});