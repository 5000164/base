const path = require("path");
const { fork } = require("child_process");
const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

let server;

if (!isDev) {
  // To run a script file inside an asar file
  const cwd = path.join(__dirname, "..");
  const cp_path = "app.asar/server/server.js";
  server = fork(cp_path, [], { cwd });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "./client/index.html"));
  }
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
