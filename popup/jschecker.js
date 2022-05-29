var check = document.querySelector('.check button');

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

check.onclick = function() {
    console.log("clicked");
    getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {check: true});
    });
}