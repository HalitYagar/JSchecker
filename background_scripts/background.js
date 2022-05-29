const seconds_in_year = 60 * 60 * 24 * 365

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function handleMessage(request, sender, sendResponse) {
  sendResponse({response: "Cookies Set"});
  cookieVal = request.cookieVal;
  cookieStr = JSON.stringify(cookieVal)
  const now = Date.now()/1000; // Unix timestamp in milliseconds
  console.log(cookieVal);
  console.log(cookieStr);
  getActiveTab().then((tabs) => {
  browser.cookies.set({
    url: tabs[0].url,
    name: "JSchecker", 
    value: cookieStr,
    expirationDate: now + seconds_in_year
  })
  });
}

browser.runtime.onMessage.addListener(handleMessage);