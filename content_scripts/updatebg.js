
async function createHash(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

function getJsFiles(){
  var entries = performance.getEntriesByType('resource');
  var filelist = entries.map(function(entry) {
    if (entry.initiatorType === 'script') {
      return entry.name;
    }
  });
  const ret = filelist.filter(file => {
    return file !== undefined;
  });
  return ret;
}

async function getFileContent(file){
  var ret;
  await fetch(file, {
    credentials: 'include'
  })
  .then(response => response.text())
  .then(data => {ret = data});
  return ret;
}

function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(type,val) {
  let sending = browser.runtime.sendMessage({
    type: type,
    cookieVal: val
  });
  sending.then(handleResponse, handleError)
  .catch(err => {
    console.log(err);});
}

async function main(filelist){

  var cookieVal = {};
  for(file of filelist){
    if(file != undefined){
      var data = await getFileContent(file);
      var filehash = await createHash(file);
      var hash = await createHash(data);
      cookieVal[filehash] = hash;
    }
  }
  const today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  cookieVal["date"] = today.toLocaleString();
  notifyBackgroundPage("set",cookieVal);
}


function eventListener(request, sender, sendResponse){

  filelist = getJsFiles();
  sendResponse({response: filelist.length});
  main(filelist);
}
browser.runtime.onMessage.addListener(eventListener);