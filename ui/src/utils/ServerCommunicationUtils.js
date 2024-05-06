const BASE_URL = process.env.REACT_APP_API_URL;

function basicResponseHandler(resp) {
  if (resp.ok) {
    return resp.json();
  } else if (resp.status === 400) {
    return resp.json()
    .then(jsonResp => {
      return { validationError: jsonResp }
    });
  } else if (resp.status === 401 || resp.status === 403) {
    return resp.json()
    .then(jsonResp => {
      return { accessDeniedError: jsonResp }
    })
  } else {
    throw Error(`Failed to call URL. Status code: ${resp.status}`);
  }
}

async function postNoAuth(url, payload) {
  // return new Promise(async(resolve, reject) => {
  //   try {
  //     let request = {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(payload)
  //     }

  //     const resp = await fetch(url, request);
  //     const json = basicResponseHandler(resp);
  //     resolve(json);
  //   } catch (error) {
  //     console.error("Error posting to url", error);
  //     reject(error);
  //   }
  // })

  // try {
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type' :'application/json'
  //     },
  //     body: JSON.stringify(payload)
  //   });
  //   const data = basicResponseHandler(response);
  // } catch (error) {
  //   console.log("Error posting to URL")
  // }

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