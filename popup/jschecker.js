var check = document.querySelector('.check button');

// let count = document.querySelector("#count");
// count.innerText = "hello";
function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
    let count = document.querySelector("#count");
    count.innerText = "JS files : "+message.response;
}

function handleError(error) {
    console.log(`Error: ${error}`);
}


check.onclick = function() {
    console.log("clicked");
    getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {check: true})
        .then(handleResponse, handleError);
    });

}