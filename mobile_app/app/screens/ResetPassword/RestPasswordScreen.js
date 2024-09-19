import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import PasswordInput from "../../components/PasswordInput";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./reset.style";
import SubmitButton from "../../components/SubmitButton";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function ResetPasswordScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ confirmPasswordErrorText, setConfirmPasswordErrorText ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ newPassword, setNewPassword ] = useState('');
  const [ newPasswordError, setNewPasswordError ] = useState(false);
  const [ newPasswordErrorText, setNewPasswordErrorText ] = useState('');
  const [ oldPassword, setOldPassword ] = useState('');
  const [ oldPasswordError, setOldPasswordError ] = useState(false);
  const [ oldPasswordErrorText, setOldPasswordErrorText ] = useState('');
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ showNewPassword, setShowNewPassword ] = useState(false);
  const [ showOldPassword, setShowOldPassword ] = useState(false);
  const [ userId, setUserId ] = useState('');
  const [ validationErrors, setValidationErrors ] = useState([]);

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    const getUserId = async () => {
      try {
        const retrievedId = await StorageUtil.getUserId();
        setUserId(retrievedId);
      } catch (error) {
        LoggerUtil.logError('ResetPasswordScreen - Error getting userId', error);
      }
    }

    getUserId();
  }, []);

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const handleSubmit = async () => {
    const conditions = [
      {
        value: oldPassword,
        setError: setOldPasswordError,
        setErrorText: setOldPasswordErrorText,
        errorMessage: 'Old Password is required'
      },
      {
        value: newPassword,
        setError: setNewPasswordError,
        setErrorText: setNewPasswordErrorText,
        errorMessage: 'New Password is required'
      }
    ];

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    if (validationErrors.length > 0) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    const payload = {};
    payload.oldPassword = oldPassword;
    payload.newPassword = newPassword;
    payload.userReference = userId;

    LoggerUtil.logDebug('Payload', payload);
    setLoading(true);
    await ServerCommunicationUtil.resetPassword(payload)
    .then(resp => {
      if (resp.status === 200) {
        showToast('Success', 'Password reset successfully');
        setConfirmPassword('');
        setNewPassword('');
        setOldPassword('');
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}]
        });
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Reset password error:', resp.notFoundError.message +'\n' + resp.notFoundError.errors );
        const errorMessages = resp.notFoundError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      } else if (resp.validationError && resp.validationError.errors) {
        setLoading(false);
        LoggerUtil.logError('Error reseting password', resp.validationError.errors);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('Error resetting password', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error resetting password');
      }
    })
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      duration: 30000,
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast} />
      }
    })
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  }

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  }

  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);

    if (text != newPassword) {
      setConfirmPasswordErrorText('Passwords do not match');
    } else {
      setConfirmPasswordErrorText('');
    }
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

  const validateNewPassword = (text) => {
    setNewPassword(text);

    const newPasswordErrors = FormattingUtil.isPasswordValid(text);
    setValidationErrors(newPasswordErrors);
  }

  if (loading) {
    return (<Loading/>);
  }

  return(
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.resetText}>{translate('resetPasswordHeading')}</Text>
      <PasswordInput
        error={oldPasswordError}
        errorText={oldPasswordErrorText}
        heading={translate('oldPassword')}
        onFocus={() => setOldPasswordError(false)}
        password={oldPassword}
        placeholder="**********"
        setPassword={setOldPassword}
        showPassword={showOldPassword}
        togglePasswordVisibility={toggleOldPasswordVisibility}
      />
      <PasswordInput
        error={newPasswordError}
        errorText={newPasswordErrorText}
        heading={translate('newPassword')}
        onFocus={() => setNewPasswordError(false)}
        password={newPassword}
        placeholder="**********"
        setPassword={validateNewPassword}
        showPassword={showNewPassword}
        togglePasswordVisibility={toggleNewPasswordVisibility}
      />
      <PasswordInput
        heading={translate('confirmPassword')}
        password={confirmPassword}
        placeholder="**********"
        setPassword={validateConfirmPassword}
        showPassword={showConfirmPassword}
        togglePasswordVisibility={toggleConfirmPasswordVisibility}
      />
      <View style={{marginTop: 5}}/>
      {validationErrors.map((item, index) => (
        <Text style={styles.validationText} key={index}>{item}</Text>
      ))}
      <Text style={styles.validationText}>{confirmPasswordErrorText}</Text>
      <SubmitButton
        btnTitle={translate('resetPassword')}
        submit={handleSubmit}
      />
    </View>
    </LinearGradient>
  );
}