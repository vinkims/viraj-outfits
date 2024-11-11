const BASE_URL = process.env.REACT_APP_API_URL;

async function get(url) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/${url}`, {
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting data", error);
    throw error;
  }
}

async function patch(url, payload) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating data", error);
    throw error;
  }
}

async function post(url, payload) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error(`HTTP error. Status :${response.status}`);
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
}

async function postNoAuth(url, payload) {
  try {
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error(`HTTP error Status: ${response.status}`);
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export default {
  get,
  patch,
  post,
  postNoAuth
}