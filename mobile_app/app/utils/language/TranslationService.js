import LoggerUtil from "../LoggerUtil";
import ServerCommunicationUtil from "../ServerCommunicationUtil";

let translations = {};

export const loadTranslations = async (lang) => {
  try {
    const response = await ServerCommunicationUtil.getLanguageTranslations(lang)
    if (response.status === 200) {
      translations[lang] = response.content.translatedText
    } else if (response.status === 404) {
      translations[lang] = 'en';
    } else if (response.authenticationError) {
      const bundledTranslations = require(`../../utils/language/en.json`);
      translations[lang] = bundledTranslations; 
    }
  } catch (error) {
    LoggerUtil.logError("Error fetching language translations", error);
    const bundledTranslations = require(`../../utils/language/en.json`);
    translations[lang] = bundledTranslations;
  }
}

export const getTranslation = (key, language) => {
  return translations[language] ? translations[language][key] || key : key;
}