const request = require("request");
const {app, BrowserWindow, ipcMain} = require('electron');
const openpgp = require('openpgp');
const fs = require('fs');
openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;

//Url where the companion server is running, along with the port
const serverUrl = "http://localhost:3000/insertSignedMessage";

const path = require('path');
const url = require('url');

//Basic window creation
function createWindow(){
  win = new BrowserWindow({width:800,height: 600,show: false})
  global.win = win;
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('ready-to-show',() => {
    win.show();
  })

  win.on('closed',() => {
    win=null;
  })
}

//Loads text file of private key and sends it to the renderer
ipcMain.on('key-file-selected', (e, args) => {
  if(args === undefined) return;
  var fileName = args[0];
  fs.readFile(fileName, 'utf-8', function(err, data){
    win.webContents.send('key-file-opened', data);
  })
});

//Recieves form fields to make and send request to server
ipcMain.on('submit-signed-message', (e,args) => {
  var status,statusMsg;
  if(args == undefined){
    status = 0;
    statusMsg = "No arguments passed from form";
    win.webContents.send('recieve-status', [status, statusMsg]);
    return;
  }
  var username = args[0];
  var password = args[1];
  var message = args[2];
  var key = args[3];
  if(!(username && password && message && key)){
    status = 0;
    statusMsg = "Please fill out all fields";
    win.webContents.send('recieve-status', [status, statusMsg]);
    return;
  }
  var signOptions = {
    data : message,
    privateKeys : [openpgp.key.readArmored(key).keys[0]]
  }
  openpgp.sign(signOptions).then(function(signed){
    var signedMsg = signed.data;
    request.post({url: serverUrl,
      form:{
        username: username,
        password: password,
        message: signedMsg,
      }
    }, function(err,response,body){
      if(err){
        status = 0;
        statusMsg = "Failed to send signed message: " + err;
        win.webContents.send('recieve-status', [status, statusMsg]);
      }
      else{
        if(response.statusCode == 200)status = 1;
        else status = 2;
        statusMsg = body;
        win.webContents.send('recieve-status', [status, statusMsg]);
      }
      return;
    });
    status = 1;
    statusMsg = "Waiting for reply from server...";
    win.webContents.send('recieve-status', [status, statusMsg]);
  }).catch(err => {
    status = 0;
    statusMsg = "Failed to sign message: \r\n" + err;
    win.webContents.send('recieve-status', [status, statusMsg]);
  });
});

exports.consolelog = function(msg){
  console.log(msg+"\nfrom renderer");
}


app.on('ready', createWindow)
app.on('window-all-closed', () => {
  console.log('Closing application');
  app.quit();
})
