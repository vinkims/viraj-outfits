import React, { createContext, useContext, useState, useEffect } from "react";

import { getTranslation, loadTranslations } from "./TranslationService";
import LoggerUtil from "../LoggerUtil";
import ServerCommunicationUtil from "../ServerCommunicationUtil";
import StorageUtil from "../StorageUtil";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [ language, setLanguage ] = useState('en');
  const [ languageLoaded, setLanguageLoaded ] = useState(false);

  useEffect(() => {
    const getStoredLanguage = async () => {
      try {
        let storedLanguage = await StorageUtil.getLanguageCode();
        
        if (!storedLanguage) {
          const userId = await StorageUtil.getUserId();
          const response = !!userId ? await ServerCommunicationUtil.getUser(userId): null;
          if (!!response && response.status === 200 && response.content.languageCode) {
            storedLanguage = response.content.languageCode;  
          } else {
            storedLanguage = 'en';
          }
        }
        setLanguage(storedLanguage);

        await loadTranslations(storedLanguage);
        setLanguageLoaded(true);
        StorageUtil.storeLanguageCode(storedLanguage);
      } catch (error) {
        LoggerUtil.logError("Error fetching user's language", error);
      }
    }

    getStoredLanguage();
  }, []);

  useEffect(() => {
    const loadLanguageTranslations = async () => {
      await loadTranslations(language || 'en');
    };
    
    if (languageLoaded) {
      loadLanguageTranslations();
    }
  }, [language, languageLoaded]);

  const translate = (key) => getTranslation(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, languageLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);