import Config from "react-native-config";

import LoggerUtil from "./LoggerUtil";
import StorageUtil from "./StorageUtil";

function basicResponseHandler(url, resp) {
  if (resp.ok || resp.status >= 200 && resp.status < 300) {
    return resp.json();
  } else if (resp.status === 400) {
    return resp.json()
    .then(jsonResp => {
      return { validationError: jsonResp }
    });
  } else if (resp.status === 404) {
    return resp.json()
    .then(jsonResp => {
      return { notFoundError: jsonResp }
    })
  } else {
    if (resp.status === 401 || resp.status === 403) {
      LoggerUtil.logError('Auth failed for URL');
      return resp.json()
      .then(jsonResp => {
        return { authenticationError: jsonResp }
      })
    }
    throw Error(`Failed to call URL: \nStatus code: ${resp.status}`);
  }
}

function get(url) {
  return new Promise((resolve, reject) => {
    StorageUtil.getToken()
    .then(token => {
      fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => basicResponseHandler(url, resp))
      .then(respJson => {
        resolve(respJson);
      })
      .catch(error => {
        LoggerUtil.logError('Error retrieving fom url', error);
        reject(error);
      })
    })
  })
}

function patch(url, payload) {
  return new Promise(async(resolve, reject) => {
    StorageUtil.getToken()
    .then(token => {
      fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json' ,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(resp => basicResponseHandler(url, resp))
      .then(respJson => {
        resolve(respJson);
      })
      .catch(error => {
        LoggerUtil.logError('Error posting to url', error);
        reject(error);
      })
    })
  })
}

function post(url, payload) {
  return new Promise(async(resolve, reject) => {
    StorageUtil.getToken()
    .then(token => {
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(resp => basicResponseHandler(url, resp))
      .then(respJson => {
        resolve(respJson);
      })
      .catch(error => {
        LoggerUtil.logError('Error posting to url', error);
        reject(error);
      })
    })
  })
}

function reqNoAuth(url, payload, method) {
  return new Promise(async(resolve, reject) => {
    try {
      let request = {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }

      const resp = await fetch(url, request);
      const respJson = basicResponseHandler(url, resp);
      resolve(respJson);
    } catch (error) {
      LoggerUtil.logError('Error posting to url', error);
      reject(error);
    }
  })
}

export default { 
  get, 
  patch, 
  post, 
  reqNoAuth,

  async allocateStock(userId, payload) {
    return patch(`${Config.API_URL}/product_item/${userId}/assignment`, payload)
  },
  async checkAppVersion() {
    const updateUrl = Config.APP_UPDATE_URL;
    return get(`${updateUrl}${Config.UPDATE_KEY}`)
  },
  async completeTopup(transactionRef) {
    return patch(`${Config.API_URL}/topup/${transactionRef}`, {})
  },
  async createUser(payload) {
    return post(`${Config.API_URL}/user`, payload)
  },
  async getAllLanguageTranslations() {
    return get(`${Config.API_URL}/language_translation`)
  },
  async getClientProductServices(params) {
    return get(`${Config.API_URL}/client/product_service?${params}`)
  },
  async getLanguageTranslations(language) {
    return get(`${Config.API_URL}/language_translation/${language}`)
  },
  async getPaymentChannels(countryCode) {
    return get(`${Config.API_URL}/payment/channel?q=paymentChannelCountries.country.countryCodeEQ${countryCode}`);
  },
  async getProducts(params) {
    return get(`${Config.API_URL}/product?${params}`)
  },
  async getProductItemById(productItemId) {
    return get(`${Config.API_URL}/product_item/${productItemId}`)
  },
  async getProductItems(params) {
    return get(`${Config.API_URL}/product_item?${params}`)
  },
  async getTransactions(params) {
    return get(`${Config.API_URL}/transaction?${params}`)
  },
  async getUser(userId) {
    return get(`${Config.API_URL}/user/${userId}`)
  },
  async login(payload) {
    return reqNoAuth(`${Config.API_URL}/auth`, payload, 'POST')
  },
  async resetPassword(payload) {
    return reqNoAuth(`${Config.API_URL}/auth/password`, payload, 'PATCH')
  },
  async sellAirtime(payload) {
    return post(`${Config.API_URL}/transaction`, payload)
  },
  async sellLine(payload) {
    return post(`${Config.API_URL}/transaction/line_sale`, payload)
  },
  async sellProduct(payload) {
    return post(`${Config.API_URL}/transaction/product`, payload)
  },
  async signout(payload) {
    return post(`${Config.API_URL}/auth/signout`, payload)
  },
  async topup(userRef, payload) {
    return post(`${Config.API_URL}/transaction/${userRef}/topup`, payload)
  },
  async topupFloat(userAccountNumber, payload) {
    return post(`${Config.API_URL}/user/${userAccountNumber}/stk_topup`, payload)
  },
  async updateProductItem(productItemId, payload) {
    return patch(`${Config.API_URL}/product_item/${productItemId}`, payload)
  },
  async updateUser(userId, payload) {
    return patch(`${Config.API_URL}/user/${userId}`, payload)
  }
}