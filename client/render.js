const {remote, ipcRenderer} = require('electron');
const dialog = remote.dialog
const {consolelog} = remote.require("./app.js");
const currentWindow = remote.getCurrentWindow();

function selectFile(){
  var options = {
    filters: [{name: "Text Files", extensions: ['txt']}],
    properties: ["openFile"],
  }
  dialog.showOpenDialog(remote.getCurrentWindow(),options,function(fileName){
    if(fileName === undefined) return;
    ipcRenderer.send('key-file-selected',fileName);
  })
}

function submitMessage(){
  var username = document.getElementById('inp_username').value;
  var password = document.getElementById('inp_password').value;
  var message = document.getElementById('inp_message').value;
  var key = document.getElementById('txt_key').value;
  ipcRenderer.send('submit-signed-message', [username,password,message,key]);
}

ipcRenderer.on('key-file-opened', function(e,data){
  if(data === undefined) return;
  document.getElementById('txt_key').value = data;
});

ipcRenderer.on('recieve-status', function(e, args){
  consolelog(e);
  consolelog(args);
  if(args === undefined) return;
  var div = document.getElementById('div_statusMsg');
  if(args[0] == 0){
    div.innerHTML = args[1];
    div.style = "color: red; font-weight: bold; text-align: left;";
  }
  else if (args[0] == 1) {
    div.innerHTML = args[1];
    div.style = "color: black; font-weight: normal; text-align: left;"
  }
  else if(args[0] == 2){
    div.innerHTML = args[1];
    div.style = "color: goldenrod; font-weight: bold; text-align: left;";
  }
})
