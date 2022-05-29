const seconds_in_year = 60 * 60 * 24 * 365

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function handleMessage(request, sender, sendResponse) {
  if(request.type == "set"){
    sendResponse({response: "Cookies Set"});
    cookieVal = request.cookieVal;
    cookieStr = JSON.stringify(cookieVal)
    const now = Date.now()/1000; // Unix timestamp in milliseconds
    // console.log(cookieVal);
    // console.log(cookieStr);
    getActiveTab().then((tabs) => {
    browser.cookies.set({
      url: tabs[0].url,
      name: "JSchecker",
      value: cookieStr,
      expirationDate: now + seconds_in_year
    })
    });
  } else if(request.type == "get"){
    sendResponse({response: "Getting Cookies"});
    console.log("get the cookies");
    getActiveTab().then((tabs) => {
      // get any previously set cookie for the current tab
      var gettingCookies = browser.cookies.get({
        url: tabs[0].url,
        name: "JSchecker"
      });
      gettingCookies.then((cookie) => {
        if (cookie) {
          var val = JSON.parse(cookie.value);
          console.log(cookie);
          console.log(val);
        }
      });
    });
  } else if(request.type == "check"){
    console.log("check cookies");

  }
}

browser.runtime.onMessage.addListener(handleMessage);