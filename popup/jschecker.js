const seconds_in_year = 60 * 60 * 24 * 365

var checkText = document.querySelector('#checkText');
var resetText = document.querySelector('#resetText');
var check = document.querySelector('.check button');
var reset = document.querySelector('.reset button');

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function handleResponse(message) {
    console.log(`Message from the update script:  ${message.response}`);
    let count = document.querySelector("#count");
    count.innerText = "JS files : "+message.response;

}

function handleError(error) {
    console.log(`Error: ${error}`);
}


check.onclick = function() {
    console.log("clicked check");
    getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {check: true})
        .then(handleResponse, handleError);
    });

}

reset.onclick = function() {
    console.log("clicked reset");
    getActiveTab().then((tabs) => {
        browser.cookies.remove({
            url: tabs[0].url,
            name: "JSchecker"
          });
    });
    // console.log("cookie removed");
    checkText.innerHTML = "";
    resetText.innerHTML = "cookie removed";
}

function compare_cokies(curr,old){
  currStr = JSON.stringify(curr);
  oldStr = JSON.stringify(old);

  if(currStr === oldStr){
    console.log("cookies are same");
    checkText.innerHTML = "&#9989;"+"Done";
  } else {
    console.log("cookies are different");
    checkText.innerHTML = "Cookies are different";
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
        checkText.innerHTML = "&#9989;"+"Cookie set";
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