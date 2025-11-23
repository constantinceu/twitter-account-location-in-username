// Runs in the page context — has full cookie/auth access
(function () {

  let twitterHeaders = null;
  let headersReady = false;

  // Capture a FULL, CLEAN set of headers from Twitter's own API calls
  function captureHeaders(headers) {
    if (!headers) return;

    const result = {};

    // Normalize Headers object → plain object
    if (headers instanceof Headers) {
      headers.forEach((value, key) => (result[key.toLowerCase()] = value));
    } else if (typeof headers === "object") {
      for (const [key, value] of Object.entries(headers)) {
        result[key.toLowerCase()] = value;
      }
    }

    // Only accept headers if they contain the important ones:
    //  • authorization
    //  • x-csrf-token
    //  • x-twitter-active-user
    if (
      result["authorization"] ||
      result["x-csrf-token"] ||
      result["x-twitter-auth-type"]
    ) {
      twitterHeaders = result;
      headersReady = true;
      console.log("Captured Twitter API headers:", result);
    }
  }

  // Monkey-patch fetch
  const originalFetch = window.fetch;
  window.fetch = function (input, init = {}) {
    const url = typeof input === "string" ? input : input.url;

    if (url.includes("/i/api/graphql")) {
      if (init.headers) captureHeaders(init.headers);
    }

    return originalFetch.call(this, input, init);
  };

  // Monkey-patch XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._graphql = url.includes("/i/api/graphql");
    return origOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
    if (!this._hdrs) this._hdrs = {};
    this._hdrs[k.toLowerCase()] = v;
    return origSetHeader.call(this, k, v);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (this._graphql && this._hdrs) captureHeaders(this._hdrs);
    return origSend.apply(this, args);
  };

  // Fallback after 3 seconds
  setTimeout(() => {
    if (!headersReady) {
      console.warn("No Twitter headers captured; using minimal fallback.");
      twitterHeaders = {
        accept: "application/json",
        "content-type": "application/json"
      };
      headersReady = true;
    }
  }, 3000);

  // Handle location-fetch requests from content script
  window.addEventListener("message", async (event) => {
    if (!event.data || event.data.type !== "__fetchLocation") return;

    const { screenName, requestId } = event.data;

    // Wait max 3 seconds for headers
    let count = 0;
    while (!headersReady && count < 30) {
      await new Promise((r) => setTimeout(r, 100));
      count++;
    }

    try {
      const variables = JSON.stringify({ screenName });
      const requestUrl =
        "https://x.com/i/api/graphql/" +
        "XRqGa7EeokUU5kppkh13EA/AboutAccountQuery" +
        "?variables=" + encodeURIComponent(variables);

      const hdrs = Object.assign({}, twitterHeaders || {});

      // Always include auth cookies
      const response = await fetch(requestUrl, {
        method: "GET",
        credentials: "include",
        headers: hdrs
      });

      let location = null;

      if (response.ok) {
        const data = await response.json();
        location =
          data?.data?.user_result_by_screen_name?.result?.about_profile
            ?.account_based_in || null;
      }

      window.postMessage(
        {
          type: "__locationResponse",
          screenName,
          location,
          requestId,
          isRateLimited: response.status === 429
        },
        "*"
      );
    } catch (err) {
      console.error("Location fetch failed:", err);
      window.postMessage(
        {
          type: "__locationResponse",
          screenName,
          location: null,
          requestId,
          isRateLimited: false
        },
        "*"
      );
    }
  });
})();
