import React, { useEffect, useRef, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import jwt_decode from "jwt-decode";
import { useToast } from "native-base";

import FormattingUtil from "../../utils/FormattingUtil";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import NavigationService from "../../services/NavigationService";
import PasswordInput from "../../components/PasswordInput";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import SubmitButton from "../../components/SubmitButton";
import styles from "./login.style";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { translate, languageLoaded } = useLanguage();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ loading, setLoading ] = useState(false);
  const [ password, setPassword ] = useState('');
  const [ passwordError, setPasswordError ] = useState(false);
  const [ passwordErrorText, setPasswordErrorText ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ usernameError, setUsernameError ] = useState(false);
  const [ usernameErrorText, setUsernameErrorText ] = useState('');

  const appName = "Gazeti";

  const logoStyles = styles.image;
  const logoSource = require('../../assets/images/Tinka_logo.png');

  useEffect(() => {
    setLoading(true);
    if (languageLoaded) {
      setLoading(false);
    }
  }, [languageLoaded]);

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  /**
   * Gets country based on currency provided
   * Temporary
   * @param {string} currency 
   * @returns 
   */
    const getCountry = (currency) => {
      const CURRENCY_COUNTRY_MAPPER = {
        MXN: {
          code: 'MEX',
          name: 'Mexico'
        },
        USD: {
          code: 'USA',
          name: 'United States of America'
        },
        KES: {
          code: 'KEN',
          name: 'Kenya'
        },
        ETB: {
          code: 'ETH',
          name: 'Ethiopia'
        }
      }
      return  CURRENCY_COUNTRY_MAPPER.hasOwnProperty(currency.toUpperCase())
        ? CURRENCY_COUNTRY_MAPPER[currency.toUpperCase()]
        : CURRENCY_COUNTRY_MAPPER.KES;
    }

  const getUserDetails = async (id) => {
    await ServerCommunicationUtil.getUser(id)
    .then(resp => {
      if (resp.status === 200) {
        if (resp.content.client) {
          StorageUtil.storeClientId(resp.content.client.id);
          StorageUtil.storeClientName(resp.content.client.name);
          StorageUtil.storeClientRef(resp.content.client.key);
          if (resp.content.client.appTheme) {
            StorageUtil.storeClientTheme(resp.content.client.appTheme);
          }
          if (resp.content.languageCode) {
            StorageUtil.storeLanguageCode(resp.content.languageCode);
          }
          if (resp.content.client.logoUrl) {
            StorageUtil.storeLogoUrl(resp.content.client.logoUrl);
          }
          if (resp.content.currency) {
            StorageUtil.storeCurrency(JSON.stringify(resp.content.currency));
            StorageUtil.storeCountry(getCountry(resp.content.currency.code))
          }
          StorageUtil.storeUserAccountNumber(resp.content.key);
        }
      } else {
        LoggerUtil.logError("Error getting user details", error);
      }
    })
    .catch(error => {
      LoggerUtil.logError("Error getting user details", error);
    })
  }

  const handleSubmit = async () => {

    const conditions = [
      {
        value: username,
        setError: setUsernameError,
        setErrorText: setUsernameErrorText,
        errorMessage: 'Username is required',
      },
      {
        value: password,
        setError: setPasswordError,
        setErrorText: setPasswordErrorText,
        errorMessage: 'Password is required',
      }
    ];

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    const userData = {}
    userData.password = password;
    if (username.startsWith("+254") || username.startsWith("254") || username.startsWith("0")) {
      userData.username = FormattingUtil.formatMobileNumber(username);
    } else {
      userData.username = username;
    }

    setLoading(true);
    try {
      const resp = await ServerCommunicationUtil.login(userData);

      if (resp.status === 200) {
        LoggerUtil.logInfo("Login successful");
        StorageUtil.storeToken(resp.content.token);
        let decodedToken = jwt_decode(resp.content.token);
        StorageUtil.storeUserId(decodedToken.userId);
        StorageUtil.storeUsername(userData.username);
        StorageUtil.storeUserRoles(decodedToken.userRoles);

        await getUserDetails(decodedToken.userId);

        setLoading(false);
        showToast('Success', 'Login successful');
        NavigationService.reset('Splash');
      } else if (resp.validationError.errors) {
        setLoading(false);
        showToast('Error', 'Invalid credentials provided');
      }
    } catch (error) {
      setLoading(false);
      LoggerUtil.logError('Login', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error logging in');
      }
    }
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      duration: 4000,
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast} />
      }
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage } = condition;
      if (!value) {
        setError(true);
        if (setErrorText) {
          setErrorText(errorMessage);
        }
        errorMessages.push(errorMessage);
      }
    }

    return errorMessages;
  }

  if (loading) {
    return (<Loading/>)
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.credentialsContainer}>
          {/* {appName === 'Trader' ? (
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/images/Tinka_logo.png")} style={styles.image} />
              <Text style={[styles.logoText, {color: theme.primaryColor}]}>Trader</Text>
            </View>
          ) : (<View style={styles.logoContainer}>
              <Image source={require("../../assets/images/mapema.png")} style={styles.imageMapema} />
              <Text style={[styles.logoText, {color: theme.primaryColor}]}>Mapema</Text>
            </View>)} */}

           {/* -- Sam Karuga -- Removed to elimitate the logo.  */}
          <Image source={logoSource} style={logoStyles} />

          <Text style={[styles.logoText, {color: theme.primaryColor}]}>{appName}</Text>
          <FormInput
            error={usernameError}
            errorText={usernameErrorText}
            heading={translate('emailOrPhone')}
            onFocus={() => setUsernameError(false)}
            placeholder="somebody@gazeti.com"
            inputValue={username}
            setValue={setUsername}
          />
          <PasswordInput
            error={passwordError}
            errorText={passwordErrorText}
            heading={translate('password')}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            onFocus={() => setPasswordError(false)}
            password={password}
            setPassword={setPassword}
          />
          <SubmitButton
            btnTitle={translate('login')}
            submit={handleSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
