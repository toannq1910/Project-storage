// fake API key
function generateKey() {
  const key = "key_" + Math.random().toString(36).substr(2, 8);
  localStorage.setItem("apiKey", key);
  showKey();
}

function showKey() {
  const key = localStorage.getItem("apiKey");
  document.getElementById("apiKeyBox").innerHTML =
    key ? "API KEY: " + key : "";
}

// fake API call
function callApi(endpoint) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          message: "Mock response from " + endpoint
        }
      });
    }, 500);
  });
}
