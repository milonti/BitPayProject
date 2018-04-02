const express = require("express");
const electron = require('electron');
const openpgp = require('openpgp');
openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;

const path = require('path');
const url = require('url');

function createWindow(){
  win = new electron.BrowserWindow({width:800,height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

}

electron.app.on('ready', createWindow)
