const {remote, ipcRenderer} = require('electron');
const formInput = remote.require("./app.js");
const currentWindow = remote.getCurrentWindow();
