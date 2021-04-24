const path = require("path");
const { fork } = require("child_process");
const { app, BrowserWindow } = require("electron");
const log = require("electron-log");

const date = new Date();
const prefix = [
  date.getFullYear().toString().padStart(4, "0"),
  (date.getMonth() + 1).toString().padStart(2, "0"),
  date.getDate().toString().padStart(2, "0"),
].join("");
const fileName = log.transports.file.fileName;
log.transports.file.fileName = `${prefix}_${fileName}`;

process.on("uncaughtException", function (err) {
  log.error("electron:event:uncaughtException");
  log.error(err);
  log.error(err.stack);
  app.quit();
});

// To run a script file inside an asar file
const cwd = path.join(__dirname, "..");
const cp_path = "app.asar/server/server.js";
const server = fork(cp_path, [], { cwd });

const createWindow = () => {
  const win = new BrowserWindow({
    transparent: true,
    vibrancy: "sidebar",
    titleBarStyle: "hiddenInset",
    width: 800,
    height: 600,
  });
  setTimeout(() => {
    win.loadFile(path.join(__dirname, "./client/index.html"));
  }, 3000);
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
