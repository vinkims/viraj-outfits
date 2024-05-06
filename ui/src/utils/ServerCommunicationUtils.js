const BASE_URL = process.env.REACT_APP_API_URL;

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
  postNoAuth
}