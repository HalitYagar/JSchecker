/* Retrieve any previously set cookie and send to content script */
console.log("Background.js");

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
    request.greeting);
  sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);