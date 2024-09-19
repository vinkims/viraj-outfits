import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Config from "react-native-config";

import { COLORS } from "../constants/theme";
import LoggerUtil from "../utils/LoggerUtil";
import NavigationService from "../services/NavigationService";
import ServerCommunicationUtil from "../utils/ServerCommunicationUtil";
import StorageUtil from "../utils/StorageUtil";
import { useLanguage } from "../utils/language/LanguageProvider";
import { useTheme } from "../theme/ThemeContext";
import { ScrollView } from "native-base";

export default function DrawerMenu(props) {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [ email, setEmail ] = useState('');
  const [ mobile, setMobile ] = useState('');
  const [ name, setName ] = useState('');
  const [ reference, setReference ] = useState('');

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userId = await StorageUtil.getUserId();
        await ServerCommunicationUtil.getUser(userId)
        .then(resp => {
          if (resp.status === 200) {
            if (typeof resp.content.email !== 'undefined') {
              setEmail(resp.content.email);
            }
            setMobile(resp.content.phoneNumber)
            setName(resp.content.firstName);
            setReference(resp.content.key);
          } else if (resp.validationError.errors) {
            LoggerUtil.logError('Error getting user details', resp.validationError.errors);
          }
        })
      } catch (error) {
        LoggerUtil.logError('Error getting user', error);
      }
    };

    getUserDetails();
  }, []);

  const handleLogout = async () => {
    let token = await StorageUtil.getToken();
    let userId = await StorageUtil.getUserId();

    const logoutData = {
      userId,
      token
    }

    await ServerCommunicationUtil.signout(logoutData)
    .then(resp => {
      if (resp.status === 200) {
        LoggerUtil.logInfo("Signout successful");
        StorageUtil.removeKeys();
        NavigationService.reset('Login');
      } else {
        StorageUtil.removeKeys();
        NavigationService.reset('Login');
      }
    }).catch(error => {
      LoggerUtil.logError('Error signing out', error);
      StorageUtil.removeKeys();
      NavigationService.reset('Login');
    })
  }

  const styles = StyleSheet.create({
    contactText: {
      color: COLORS.black,
      fontSize: 14,
      fontWeight: "500"
    },
    container: {
      flex: 1,
      height: "100%",
      marginVertical: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    copyTextContainer: {
      borderColor: theme.primaryColor,
      borderRadius: 5,
      borderWidth: 1,
      justifyConent: "center",
      padding: 1
    },
    detailsView: {
      alignItems: "center",
      height: "50%"
    },
    logoutButton: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      width: "100%"
    },
    logoutImage: {
      height: 25,
      width: 25
    },
    logoutText: {
      color: COLORS.red,
      fontSize: 18,
      marginLeft: 5
    },
    logoutView: {
      alignItems: "center",
      width: "100%",
      paddingTop: 10
    },
    nameText: {
      color: COLORS.black,
      fontSize: 20,
      fontWeight: "600"
    },
    profileImage: {
      borderRadius: 1,
      height: 70,
      width: 70
    },
    profileImageView: {
      alignItems: "center",
      borderColor: COLORS.grey,
      borderRadius: 40,
      borderWidth: 1,
      height: 80,
      justifyContent: "center",
      width: 80
    },
    referenceView: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 30
    },
    refHeading: {
      color: COLORS.black,
      fontSize: 14
    },
    refText: {
      color: COLORS.black,
      fontSize: 15,
      fontWeight: "700",
    },
    versionText: {
      color:COLORS.black,
      fontWeight: 'bold',
      marginTop: 30,
    },
    welcomeText: {
      color: COLORS.red,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center"
    },
    welcomeView: {
      alignSelf: "center",
      flexDirection: "row",
      marginTop: 30
    }
  });

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.welcomeText}>{translate('welcome')}, </Text>
        <Text style={styles.nameText}> {name}</Text>
      </View>
      <View style={styles.referenceView}>
        <Text style={styles.refHeading}>{translate('accountNumber')}: </Text>
        <View style={styles.copyTextContainer}>
          <Text style={styles.refText} selectable>{reference}</Text>
        </View>
      </View>
      <ScrollView>
        <DrawerItemList {...props}/>
      </ScrollView>
      <View style={styles.logoutView}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image source={require('../assets/images/logout.png')} style={styles.logoutImage} />
          <Text style={styles.logoutText}>{translate('logout')}</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>{translate('version')}: {Config.VERSION_NUMBER}</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles1 = StyleSheet.create({
  contactText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "500"
  },
  container: {
    flex: 1,
    height: "100%",
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  copyTextContainer: {
    borderColor: COLORS.primary,
    borderRadius: 5,
    borderWidth: 1,
    justifyConent: "center",
    padding: 1
  },
  detailsView: {
    alignItems: "center",
    height: "50%"
  },
  logoutButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%"
  },
  logoutImage: {
    height: 25,
    width: 25
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: 18,
    marginLeft: 5
  },
  logoutView: {
    alignItems: "center",
    bottom: 30,
    position: "absolute",
    width: "100%"
  },
  nameText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: "600"
  },
  profileImage: {
    borderRadius: 1,
    height: 70,
    width: 70
  },
  profileImageView: {
    alignItems: "center",
    borderColor: COLORS.grey,
    borderRadius: 40,
    borderWidth: 1,
    height: 80,
    justifyContent: "center",
    width: 80
  },
  referenceView: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30
  },
  refHeading: {
    color: COLORS.black,
    fontSize: 14
  },
  refText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "700",
  },
  versionText: {
    color:COLORS.black,
    fontWeight: 'bold',
    marginTop: 30,
  },
  welcomeText: {
    color: COLORS.red,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  welcomeView: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 30
  }
});