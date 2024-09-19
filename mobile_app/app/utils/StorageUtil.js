import AsyncStorage from "@react-native-async-storage/async-storage";
import LoggerUtil from "./LoggerUtil";

const CLIENTID = "clientId";
const CLIENTNAME = "clientName";
const CLIENTREF = "clientRef";
const CLIENTTHEME = "clientTheme";
const CURRENCY = "currency";
const COUNTRY = "country";
const LANGUAGE = "language";
const LOGOURL = "logoUrl";
const PENDING_TRANSACTION = "pendingTransaction";
const SERIAL = "serialNumber";
const SERIALSTORED = "serialStored";
const TOKEN = "accessToken";
const USERACCOUNTNUMBER = "userAccountNumber";
const USERID = "userId";
const USERNAME = "username";
const USERROLES = "userRoles";

let storageKeys = [];

export default {

  async getClientId() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(CLIENTID)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading client id from storage", error);
        reject(error);
      })
    })
  },

  async getClientName() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(CLIENTNAME)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading client name from storage", error);
        reject(error);
      })
    })
  },

  async getClientRef() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(CLIENTREF)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading client reference from storage", error);
        reject(error);
      })
    })
  },

  async getClientTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(CLIENTTHEME)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading client theme from storage", error);
        reject(error);
      })
    })
  },

  async getCountry() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(COUNTRY)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(JSON.parse(value));
      })
      .catch(error => {
        LoggerUtil.logError("Error reading currency from storage", error);
        reject(error);
      })
    })
  },

  async getCurrency() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(CURRENCY)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading currency from storage", error);
        reject(error);
      })
    })
  },

  async getLanguageCode() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(LANGUAGE)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(null);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading language from storage", error);
        reject(error);
      })
    })
  },

  async getLogoUrl() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(LOGOURL)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading logo url from storage", error);
        reject(error);
      })
    })
  },

  async getPendingTransaction() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(PENDING_TRANSACTION)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(JSON.parse(value));
      })
      .catch(error => {
        LoggerUtil.logError("Error reading pending transaction from storage", error);
        reject(error);
      })
    })
  },

  async getSerialNumber() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(SERIAL)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading serial number from storage", error);
        reject(error);
      })
    })
  },

  async getSerialStored() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(SERIALSTORED)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading serial stored from storage", error);
        reject(error);
      })
    })
  },

  async getToken() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(TOKEN)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading from storage", error);
        reject(error);
      })
    })
  },

  async getUserAccountNumber() {
    return new Promise((resolve, reject) =>{
      AsyncStorage.getItem(USERACCOUNTNUMBER)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading from storage", error);
        reject(error);
      })
    })
  },

  async getUserId() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USERID)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading from storage", error);
        reject(error);
      })
    })
  },

  async getUsername() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USERNAME)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading from storage", error);
        reject(error);
      })
    })
  },

  async getUserRoles() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USERROLES)
      .then(value => {
        if (value == null) {
          return resolve(null);
        }
        resolve(JSON.parse(value));
      })
      .catch(error => {
        LoggerUtil.logError("error reading from storage", error);
        reject(error);
      })
    })
  },

  async removeItem(item) {
    try {
      await AsyncStorage.removeItem(item)
    } catch (error) {
      LoggerUtil.logError(`error removing ${item} from storage`, error);
    }
  },

  async removeKeys() {
    let keys = storageKeys;
    keys.push(CLIENTID, CLIENTREF, CURRENCY, LOGOURL, SERIAL, SERIALSTORED, TOKEN, USERID, USERNAME, USERROLES);
    try {
      await AsyncStorage.multiRemove(keys);
      return storageKeys = [];
    } catch (error) {
      LoggerUtil.logError("error removing keys", error);
    }
  },

  async storeClientId(clientId) {
    await AsyncStorage.setItem(CLIENTID, JSON.stringify(clientId))
    .then(LoggerUtil.logInfo("successfully saved clientId"))
    .catch(error => {
      LoggerUtil.logError("error saving clientId", error);
    })
  },

  async storeClientName(clientName) {
    await AsyncStorage.setItem(CLIENTNAME, clientName)
    .then(LoggerUtil.logInfo("successfully saved clientName"))
    .catch(error => {
      LoggerUtil.logError("error saving clientName", error);
    })
  },

  async storeClientRef(clientRef) {
    await AsyncStorage.setItem(CLIENTREF, clientRef)
    .then(LoggerUtil.logInfo("successfully saved clientRef"))
    .catch(error => {
      LoggerUtil.logError("error saving clientRef", error);
    })
  },

  async storeClientTheme(theme) {
    const themeMap = JSON.stringify(theme);
    await AsyncStorage.setItem(CLIENTTHEME, themeMap)
    .then(LoggerUtil.logInfo("successfully saved clientTheme"))
    .catch(error => {
      LoggerUtil.logError("error saving clientTheme", error);
    })
  },

  async storeCountry(country) {
    await AsyncStorage.setItem(COUNTRY, JSON.stringify(country))
      .catch(error => {
        LoggerUtil.logError("error saving country", error);
      })
  },

  async storeCurrency(currency) {
    await AsyncStorage.setItem(CURRENCY, currency)
    .then(LoggerUtil.logInfo("successfully saved currency"))
    .catch(error => {
      LoggerUtil.logError("error saving currency", error);
    })
  },

  async storeLanguageCode(languageCode) {
    await AsyncStorage.setItem(LANGUAGE, languageCode)
    .then(LoggerUtil.logInfo("Successfully saved language code"))
    .catch(error => {
      LoggerUtil.logError("error saving language code", error);
    })
  },

  async storeLogoUrl(logoUrl) {
    await AsyncStorage.setItem(LOGOURL, logoUrl)
    .then(LoggerUtil.logInfo("successfully saved logo utl"))
    .catch(error => {
      LoggerUtil.logError("error saving logo url", error);
    })
  },

  async storeSerialNumber(serial) {
    await AsyncStorage.setItem(SERIAL, serial)
    .then(LoggerUtil.logInfo("successfully saved serial"))
    .catch(error => {
      LoggerUtil.logError("error saving serial", error);
    })
  },

  async storePendingTransaction(transaction) {
    await AsyncStorage.setItem(PENDING_TRANSACTION, JSON.stringify(transaction))
      .then(LoggerUtil.logInfo("successfully saved pending transaction"))
      .catch(error => {
        LoggerUtil.logError("error saving pending transaction", error);
      })
  },

  async storeSerialStored(serialStored) {
    await AsyncStorage.setItem(SERIALSTORED, serialStored)
    .then(LoggerUtil.logInfo("successfully saved serial stored"))
    .catch(error => {
      LoggerUtil.logError("error saving serial stored", error);
    })
  },

  async storeToken(token) {
    await AsyncStorage.setItem(TOKEN, token)
    .then(LoggerUtil.logInfo("successfully saved token"))
    .catch(error => {
      LoggerUtil.logError("error saving token", error);
    })
  },

  async storeUserAccountNumber(accountNumber) {
    await AsyncStorage.setItem(USERACCOUNTNUMBER, accountNumber)
    .then(LoggerUtil.logInfo("successfully saved account number"))
    .catch(error => {
      LoggerUtil.logError("error saving account number", error)
    })
  },
  
  async storeUserId(id) {
    await AsyncStorage.setItem(USERID, JSON.stringify(id))
    .then(LoggerUtil.logInfo("successfully saved userId"))
    .catch(error => {
      LoggerUtil.logError("error saving user id", error);
    })
  },

  async storeUsername(username) {
    await AsyncStorage.setItem(USERNAME, username)
    .then(LoggerUtil.logInfo("successfully saved username"))
    .catch(error => {
      LoggerUtil.logError("error saving username", error);
    })
  },

  async storeUserRoles(userRoles) {
    await AsyncStorage.setItem(USERROLES, JSON.stringify(userRoles))
    .then(LoggerUtil.logInfo("successfully saved userRoles"))
    .catch(error => {
      LoggerUtil.logError("error saving userRoles", error);
    })
  }
}