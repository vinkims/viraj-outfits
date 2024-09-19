import React from "react";
import { StyleSheet, Text, TextInput, View} from "react-native";

import { COLORS } from "../constants/theme";
import { useLanguage } from "../utils/language/LanguageProvider";

export default function FormInput({heading, inputValue, setValue, placeholder, secureTextEntry, optional, error, errorText, ...rest}) {
  const { translate } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.headingText}>{heading}</Text>
        {optional && <Text style={styles.optionalText}>{"("}{translate('optional')}{")"}</Text>}
      </View>
      <TextInput 
        style={[styles.textInput, {borderColor: error ? COLORS.red : COLORS.grey}]}
        onChangeText={(text) => setValue(text)}
        value={inputValue}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grey}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
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
    color: COLORS.black
  },
  optionalText: {
    color: COLORS.red,
    marginLeft: 5
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 1,
    color: COLORS.black,
    height: 50,
    marginTop: 5,
    width: "100%"
  },
  textView: {
    flexDirection: "row"
  }
});