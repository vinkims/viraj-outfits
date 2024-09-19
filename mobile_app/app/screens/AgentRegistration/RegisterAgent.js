import React, { useCallback, useRef, useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import Config from "react-native-config";
import Clipboard from "@react-native-community/clipboard";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ModalComponent from "../../components/ModalComponent";
import PasswordGenerator from "../../utils/PasswordGenerator";
import PasswordInput from "../../components/PasswordInput";
import { useLanguage } from "../../utils/language/LanguageProvider";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./register.style";
import SubmitButton from "../../components/SubmitButton";
import ToastComponent from "../../components/Toast";
import { useTheme } from "../../theme/ThemeContext";

export default function RegisterAgent() {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ email, setEmail ] = useState('');
  const [ emailError, setEmailError ] = useState(false);
  const [ emailErrorText, setEmailErrorText ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ mobileNumber, setMobileNumber ] = useState('');
  const [ mobileNumberError, setMobileNumberError ] = useState(false);
  const [ mobileNumberErrorText, setMobileNumberErrorText ] = useState('');
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ successModalVisible, setSuccessModalVisible ] = useState(false);
  const [ name, setName ] = useState('');
  const [ nameError, setNameError ] = useState(false);
  const [ nameErrorText, setNameErrortext ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordError, setPasswordError ] = useState(false);
  const [ passwordErrorText, setPasswordErrorText ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');
  const [ passwordConfirmErrorText, setPasswordConfirmErrorText ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ validationErrors, setValidationErrors ] = useState([]);
  const [agentMessageDetails, setAgentMessageDetails ] = useState({name: '', password: '', phone: ''});

  const gradientColors = [theme.gradientStart, COLORS.white];

  const clearForm = () => {
    setEmail('');
    setMobileNumber('');
    setName('');
    setPassword('');
    setPasswordConfirm('');
    setShowConfirmPassword(false);
    setShowPassword(false);
    setAgentMessageDetails({name: '', password: '', phone: ''})
  }

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const getSuccessMessage = useCallback(() => {
    return (
      `Hey ${agentMessageDetails.name.toUpperCase()}! You have been successfully added as a Trader agent.`
      + ` Your temporary password is ${agentMessageDetails.password}.\nDownload the app from ${Config.APP_DOWNLOAD_URL}, and start selling.`
    )
  }, [agentMessageDetails])

  const getPassword = () => {
    setPassword(PasswordGenerator.generatePassword());
  }

  const handleAgentMessage = () => {
    if (!!mobileNumber) {
      showToast('Success', 'Agent registration message redirect');
      Linking.openURL(`sms:${agentMessageDetails.phone}${Platform.OS === "ios" ? "&" : "?"}body=${getSuccessMessage()}`)
    } else {
      Clipboard.setString(getSuccessMessage())
      showToast('Success', 'Agent registration message copied to clipboard');
    }
    clearForm()
    setSuccessModalVisible(false)
  }

  const handleDetailsConfirm = async () => {
    const conditions = [
      {
        value: name,
        setError: setNameError,
        setErrorText: setNameErrortext,
        errorMessage: 'Enter name'
      },
      {
        value: mobileNumber,
        setError: setMobileNumberError,
        setErrorText: setMobileNumberErrorText,
        errorMessage: 'Enter mobile number',
        min: 10,
        max: 13
      },
      {
        value: password,
        setError: setPasswordError,
        setErrorText: setPasswordErrorText,
        errorMessage: 'Enter password'
      }
    ];

    const errorMessages = validateInputs(conditions);

    if (email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        // return emailPattern.test(text);
      if (emailPattern.test(email) === false) {
        setEmailError(true);
        setEmailErrorText("invalid email address");
        return;
      }
    }

    if (errorMessages.length > 0) {
      return;
    }

    if (validationErrors.length > 0) {
      return;
    }

    if (password !== passwordConfirm) {
      return;
    }

    setModalVisible(true);
  }

  const handleEmailChange = (text) => {
    setEmail(text);
    const isValid = validateEmail(validateEmail(text));
    if (!isValid) {
      setEmailError(true);
      setEmailErrorText("invalid email format");
    } else {
      setEmailError(false);
      setEmailErrorText('');
    }
  }

  const handleModalClose = (isConfirm = true) => {
    if (isConfirm) {
      setModalVisible(!modalVisible);
    } else {
      setSuccessModalVisible(!successModalVisible);
      clearForm()
    }
  }

  const handleSubmit = async () => {
    handleModalClose();

    let clientId = await StorageUtil.getClientId();
    let userId = await StorageUtil.getUserId();

    const payload = {};

    payload.clientId = Number(clientId)
    if (email) {
      payload.email = email;
    }
    if (mobileNumber) {
      payload.phoneNumber = FormattingUtil.formatMobileNumber(mobileNumber);
    }

    const names = FormattingUtil.splitName(name);
    if (names.FirstName) {
      payload.firstName = names.FirstName;
    }
    if (names.LastName) {
      payload.lastName = names.LastName;
    }
    if (names.MiddleName) {
      payload.middleName = names.MiddleName;
    }

    payload.password = password;
    payload.userRelations = [{ parentUserId: userId}]
    payload.userRoles = [{ roleId: 7 }];

    LoggerUtil.logDebug('Payload', payload);
    setLoading(true);
    await ServerCommunicationUtil.createUser(payload)
    .then(resp => {
      if (resp.status === 201) {
        LoggerUtil.logInfo("Successfully created user");
        setLoading(false);
        setAgentMessageDetails({name: name, password: password, phone: mobileNumber})
        setSuccessModalVisible(true)
        // showToast('Success', 'Agent successfully registered');
      } else if (resp.validationError.errors) {
        setLoading(false);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('RegisterAgent', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error registering agent');
      }
    })
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast} />
      }
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage, min, max} = condition;
      if (!value) {
        setError(true);
        if (setErrorText) {
          setErrorText(errorMessage);
        }
        errorMessages.push(errorMessage);
      } else if (typeof min === 'number' && value.length < min) {
        setError(true);
        if (setErrorText) {
          setErrorText(`Should be between ${min} to ${max} characters`);
        }
        errorMessages.push(`Should be between ${min} to ${max} characters`);
      } else if (typeof max === 'number' && value.length > max) {
        setError(true);
        if (setErrorText) {
          setErrorText(`Should be between ${min} to ${max} characters`);
        }
        errorMessages.push(`Should be between ${min} to ${max} characters`);
      }
    }
    return errorMessages;
  }

  const validatePassword = (text) => {
    setPassword(text);

    const passwordErrors = FormattingUtil.isPasswordValid(text);

    setValidationErrors(passwordErrors);
  }

  const validatePasswordConfirm = (text) => {
    setPasswordConfirm(text);

    if (text !== password) {
      setPasswordConfirmErrorText('Passwords do not match');
    } else {
      setPasswordConfirmErrorText('');
    }
  }

  const ModalContent = () => (
    <View>
      <Text style={styles.confirmText}>{translate('confirmAgentDetails')}</Text>
      <View style={styles.detailsView}>
        <Text style={styles.confirmTitle}>{translate('name')}: </Text>
        <Text style={[styles.confirmRes, {color: theme.primaryColor}]}>{name}</Text>
      </View>
      <View style={styles.detailsView}>
        <Text style={styles.confirmTitle}>{translate('mobileNumber')}: </Text>
        <Text style={[styles.confirmRes, {color: theme.primaryColor}]}>{mobileNumber}</Text>
      </View>
      {email &&
        <View style={styles.detailsView}>
          <Text style={styles.confirmTitle}>{translate('email')}: </Text>
          <Text style={[styles.confirmRes, {color: theme.primaryColor}]}>{email}</Text>
        </View>
      }
      <View style={styles.detailsView}>
        <Text style={styles.confirmTitle}>{translate('password')}: </Text>
        <Text style={[styles.confirmRes, {color: theme.primaryColor}]}>{password}</Text>
      </View>
    </View>
  )

  const SuccessModalContent = () => (
    <View>
      <Text style={styles.agentMessageTitle}>{translate('success').toUpperCase()}</Text>
      <Text style={styles.agentMessageText}>{getSuccessMessage()}</Text>
    </View>
  )

  if (loading) {
    return (<Loading/>);
  }

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.modalParentView}>
          <ModalComponent
            modalVisible={modalVisible}
            handleModalClose={handleModalClose}
            modalContent={<ModalContent/>}
            handleConfirm={handleSubmit}
          />
        </View>
        <View style={styles.modalParentView}>
          <ModalComponent
            modalVisible={successModalVisible}
            handleModalClose={() => handleModalClose(false)}
            modalContent={<SuccessModalContent/>}
            handleConfirm={handleAgentMessage}
            confirmBtnText='send'
          />
        </View>
        <Text style={styles.headingText}>{translate('enterAgentDetails')}</Text>
        <View style={styles.formView}>
          <FormInput
            error={nameError}
            errorText={nameErrorText}
            heading={translate('agentName')}
            onFocus={() => setNameError(false)}
            placeholder="e.g Good Agent"
            inputValue={name}
            setValue={setName}
          />
          <FormInput
            error={mobileNumberError}
            errorText={mobileNumberErrorText}
            heading={translate('mobileNumber')}
            keyboardType="numeric"
            onFocus={() => setMobileNumberError(false)}
            placeholder="e.g 245720123456"
            inputValue={mobileNumber}
            setValue={setMobileNumber}
          />
          <FormInput
            error={emailError}
            errorText={emailErrorText}
            heading={translate('email')}
            onFocus={() => setEmailError(false)}
            optional={true}
            placeholder="e.g goodagent@goodfirm.com"
            inputValue={email}
            setValue={setEmail}
          />
          {/* <View style={styles.passwordView}>
            <Text style={styles.passwordViewHeadingText}>Password:</Text>
            <View style={styles.passwordTextView}>
              <Text style={styles.passwordText} selectable>{password}</Text>
            </View>
            <TouchableOpacity style={styles.passwordRefreshView} onPress={getPassword}>
              <Icon name="refresh" size={30} color={COLORS.black} />
            </TouchableOpacity>
          </View> */}
          <PasswordInput
            error={passwordError}
            errorText={passwordErrorText}
            onFocus={() => setPasswordError(false)}
            heading={translate('password')}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            password={password}
            setPassword={validatePassword}
          />
          <PasswordInput
            heading={translate('confirmPassword')}
            showPassword={showConfirmPassword}
            togglePasswordVisibility={toggleConfirmPasswordVisibility}
            password={passwordConfirm}
            setPassword={validatePasswordConfirm}
          />
          <View style={{marginTop: 5}}/>
          {validationErrors.map((item, index) => (
            <Text style={styles.validationText} key={`${index}`}>{item}</Text>
          ))}
          <Text style={styles.validationText}>{passwordConfirmErrorText}</Text>
          <SubmitButton
            btnTitle={translate('registerAgent')}
            submit={handleDetailsConfirm}
          />
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}