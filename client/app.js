const express = require("express");
const {app, BrowserWindow, ipcMain} = require('electron');
const openpgp = require('openpgp');
const fs = require('fs');
openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;


const path = require('path');
const url = require('url');

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

ipcMain.on('key-file-selected', (e, args) => {
  if(args === undefined) return;
  var fileName = args[0];
  fs.readFile(fileName, 'utf-8', function(err, data){
    win.webContents.send('key-file-opened', data);
  })
})

ipcMain.on('submit-signed-message', (e,args) => {
  console.log("submitting message");
  console.log(args);
  var status,statusMsg;
  status = 0;
  statusMsg = "It done broke";
  win.webContents.send('recieve-status', [status, statusMsg]);
})

exports.consolelog = function(msg){
  console.log(msg+"\nfrom renderer");
}


app.on('ready', createWindow)
app.on('window-all-closed', () => {
  console.log('Closing application');
  app.quit();
})
