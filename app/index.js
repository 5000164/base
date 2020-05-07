const path = require("path");
const { fork } = require("child_process");
const { app, BrowserWindow } = require("electron");

// To run a script file inside an asar file
const cwd = path.join(__dirname, "..");
const cp_path = "app.asar/server/server.js";
const server = fork(cp_path, [], { cwd });

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  win.loadFile(path.join(__dirname, "./client/index.html"));
};

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (server) {
    server.kill();
  }
});
