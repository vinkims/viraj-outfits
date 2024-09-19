import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import { languages } from "../../constants/properties";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./profile.styles";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function ProfileScreen() {
  const { setLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ availableLanguages, setAvailableLanguages ] = useState(
    languages.map(lang => ({
      label: lang.name,
      value: lang.code
    }))
  );
  const [ appLanguage, setAppLanguage ] = useState('');
  const [ bonus, setBonus ] = useState('');
  const [ confirmedCommission, setConfirmedCommission ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ float, setFloat ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ middleName, setMiddleName ] = useState('');
  const [ openLanguages, setOpenlanguages ] = useState(false);
  const [ pendingCommission, setPendingCommission ] = useState('') ;
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ reference, setReference ] = useState('');
  const [ role, setRole ] = useState('');
  const [ selected, setSelected ] = useState('');

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        let userId = await StorageUtil.getUserId();
        await ServerCommunicationUtil.getUser(userId)
        .then(resp => {
          if (resp.status === 200) {
            setBonus(resp.content.bonus ? resp.content.bonus : '0');
            setConfirmedCommission(resp.content.confirmedCommission 
              ? resp.content.confirmedCommission : '0');
            setEmail(resp.content.email);
            setFirstName(resp.content.firstName);
            setFloat(resp.content.float);
            if (resp.content.languageCode) {
              const language = findLanguageByCode(resp.content.languageCode);
              setAppLanguage(language.name);
            }
            setLastName(resp.content.lastName);
            setMiddleName(resp.content.middleName);
            setPendingCommission(resp.content.pendingCommission
              ? resp.content.pendingCommission : '0');
            setPhoneNumber(resp.content.phoneNumber);
            setReference(resp.content.key);
            setRole(resp.content.userRoles[0].role.name);
          }
        })
      } catch (error) {
        LoggerUtil.logError("Error getting user", error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    const getAllLanguages = async () => {
      try {
        setLoading(true);
        await ServerCommunicationUtil.getAllLanguageTranslations()
        .then(resp => {
          if (resp.status === 200 && resp.content.data.length > 0) {
            setAvailableLanguages(resp.content.data.map((lang) => ({
              label: lang.language,
              value: lang.languageCode
            })));
          }
        })
      } catch (error) {
        
      }
    };

    getAllLanguages();
  }, []);

  const findLanguageByCode = (code) => {
    const foundLanguage = languages.find(lang => lang.code === code);
    return foundLanguage || null;
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} />
      }
    })
  }

  const updateLanguage = async (selected) => {
    let payload = {
      languageCode: selected.value
    };

    setLoading(true);
    let userId = await StorageUtil.getUserId();
    await ServerCommunicationUtil.updateUser(userId, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        showToast('Success', 'Successfully changed language');
        setAppLanguage(selected.label);
        setLanguage(selected.value);
      }
    })
    .catch(error => {
      LoggerUtil.logError("Error changing language", error);
      showToast('Error', 'Error changing language');
    })
  }

  if (loading) {
    return (<Loading/>)
  }

  const TextContainer = ({ heading, description }) => {
    return (
      <View style={styles.detailsTextView}>
        <Text style={styles.detailsHeadingText}>{heading}</Text>
        <Text style={styles.detailsText}>{description}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <TextContainer heading={translate('firstName')} description={firstName} />
      {middleName && <TextContainer heading={translate('middleName')} description={middleName} />}
      {lastName && <TextContainer heading={translate('lastName')} description={lastName} />}
      <View style={styles.detailsTextView}>
        <Text style={styles.detailsHeadingText}>{translate('accountNumber')}</Text>
        <Text style={styles.detailsText} selectable>{reference}</Text>
      </View>
      <TextContainer heading={translate('float')} description={float.toLocaleString()} />
      {email && <TextContainer heading={translate('email')} description={email} />}
      {phoneNumber && <TextContainer heading={translate('mobileNumber')} description={phoneNumber} />}
      <TextContainer heading={translate('confirmedCommission')} description={confirmedCommission.toLocaleString()} />
      <TextContainer heading={translate('pendingCommission')} description={pendingCommission.toLocaleString()} />
      <TextContainer heading={translate('bonus')} description={bonus.toLocaleString()} />
      <TextContainer heading={translate('role')} description={role} />
      <View style={styles.detailsTextView}>
        <Text style={styles.detailsHeadingText}>{translate('language')}</Text>
        <TouchableOpacity style={styles.languageView} onPress={() => setOpenlanguages(true)}>
          {!openLanguages ? (
            <Text style={styles.detailsText}>{appLanguage}</Text>
          ) : (
            <DropDownPicker
              disableBorderRadius={true}
              open={openLanguages}
              value={selected}
              items={availableLanguages}
              setOpen={setOpenlanguages}
              setValue={setSelected}
              setItems={setAvailableLanguages}
              placeholder={translate('selectLanguage')}
              onSelectItem={(val) => updateLanguage(val)}
              style={{
                width: "80%"
              }}
              containerStyle={{
                width: "70%"
              }}
            />
          )}
          
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
}