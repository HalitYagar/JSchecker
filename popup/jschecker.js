var check = document.querySelector('.check button');
var reset = document.querySelector('.reset button');

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
    console.log("cookie removed");

}