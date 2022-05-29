
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
  return filelist;
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

function notifyBackgroundPage(e) {
  let sending = browser.runtime.sendMessage({
    cookieVal: e
  });
  sending.then(handleResponse, handleError)
  .catch(err => {
    console.log('Oh noooo!!');
    console.log(err);});
}

async function main(){
  var cookieVal = {};  
  filelist = getJsFiles();
  for(file of filelist){
    if(file != undefined){
      var data = await getFileContent(file);
      var filehash = await createHash(file);
      var hash = await createHash(data);
      cookieVal[filehash] = hash;
      // console.log(filehash);
      // console.log(data);
      // console.log(hash);
    }
  }
  console.log(Object.keys(cookieVal).length);
  notifyBackgroundPage(cookieVal);
}

main();
