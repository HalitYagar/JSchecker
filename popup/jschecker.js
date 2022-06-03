const seconds_in_year = 60 * 60 * 24 * 365

var text = document.querySelector('.text');
var check = document.querySelector('.check button');
var reset = document.querySelector('.reset button');

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function handleResponse(message) {
    console.log(`Message from the update script:  ${message.response}`);
    // let count = document.querySelector("#count");
    // count.innerText = "JS files : "+message.response;

}

function handleError(error) {
    console.log(`Error: ${error}`);
}


check.onclick = function() {
    console.log("clicked check");
    text.innerHTML = "";
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
    text.innerHTML = "&#8414; Cookie removed";
}

function compare_cokies(curr,old){
    oldCount  = Object.keys(old).length;
    currCount = Object.keys(curr).length;
    console.log(oldCount,currCount);
    var diff = oldCount - currCount;
    if(diff > 0){
        if(diff == 1){
            text.innerHTML = "&#10060; "+diff+" JS file are removed";
        } else {
            text.innerHTML = "&#10060; "+diff+" JS files are removed";
        }
    } else if(diff < 0){
        diff *= -1;
        if(diff == 1){
            text.innerHTML = "&#10060; "+diff+" New JS files added";
        } else {
            text.innerHTML = "&#10060; "+diff+" New JS files added";
        }
    } else {
        var count = 0;

        for(const oldFile in old){
            console.log(`${oldFile}: ${old[oldFile]}`);
            console.log(curr[oldFile]);
            if(oldFile == "date"){continue;}
            if(curr[oldFile] == undefined){
                count++;
            } else if(curr[oldFile] != old[oldFile]){
                count++;
            }
        }
        if(count != 0){
            if(count == 1){
                text.innerHTML = "&#10060; "+ count +" JS file are changed ";
            } else {
                text.innerHTML = "&#10060; "+ count +" JS file are changed ";
            }
        } else {
            text.innerHTML = "&#9989; JS files are the same";
        }

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
        console.log("compare cookies ");
        compare_cokies(currCookie,oldCookie);
    } else {  // there are no currently set cookies
        text.innerHTML = "&#9632; Cookie set";
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

getActiveTab().then((tabs) => {
    var oldCookie;
    var gettingCookies = browser.cookies.get({
    url: tabs[0].url,
    name: "JSchecker"
    });
    gettingCookies.then((cookie) => {
        if (cookie) { // there is cookies that saved previously
            oldCookie = JSON.parse(cookie.value);
            // console.log(cookie);
            var numFiles = Object.keys(oldCookie).length-1;
            let time = document.querySelector("#time");
            time.innerText = "Last access : "+oldCookie["date"];
            let count = document.querySelector("#count");
            count.innerText = "JS files : " + numFiles;
        }
    });
});