const seconds_in_year = 60 * 60 * 24 * 365

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function compare_cokies(curr,old){
  console.log(curr);
  console.log(old);
  currStr = JSON.stringify(curr);
  oldStr = JSON.stringify(old);

  if(currStr === oldStr){
    console.log("cookies are same");
  } else {
    console.log("cookies are different");
  }
}

function handleMessage(request, sender, sendResponse) {
  console.log("get the cookies");
  sendResponse({response: "Getting Cookies"});
  currCookie = request.cookieVal;
  cookieStr = JSON.stringify(currCookie)
  const now = Date.now()/1000; // Unix timestamp in milliseconds

  getActiveTab().then((tabs) => {
    // get any previously set cookie for the current tab
    var oldCookie;
    var gettingCookies = browser.cookies.get({
      url: tabs[0].url,
      name: "JSchecker"
    });
    gettingCookies.then((cookie) => {
      if (cookie) { // there is cookies that saved previously
        oldCookie = JSON.parse(cookie.value);
        // console.log(existingCookie);
        console.log("compare cookies ");
        compare_cokies(currCookie,oldCookie);
      } else {  // there are no currently set cookies
        browser.cookies.set({
          url: tabs[0].url,
          name: "JSchecker",
          value: cookieStr,
          expirationDate: now + seconds_in_year
        });
        console.log("adding new cookie ");
      }
    });
  });
}

browser.runtime.onMessage.addListener(handleMessage);