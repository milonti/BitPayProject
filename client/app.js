const express = require("express");
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const openpgp = require('openpgp');
openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;

const path = require('path');
const url = require('url');

function createWindow(){
  win = new BrowserWindow({width:800,height: 600,show: false})

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

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  console.log('Closing application');
  app.quit();
})
