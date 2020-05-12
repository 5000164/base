import os from "os";
import fs from "fs";
import path from "path";
import log from "electron-log";

export interface Settings {
  dbPath?: string;
}

const userDataPath = `${os.homedir()}/Library/Application Support/base`;
const settingPath = path.join(userDataPath, "settings.json");

try {
  fs.accessSync(settingPath);
} catch (e) {
  fs.mkdirSync(userDataPath, { recursive: true });
  fs.writeFileSync(settingPath, "{}\n");
}

const userSettings: Settings = JSON.parse(fs.readFileSync(settingPath, "utf8"));
log.debug(userSettings);

const dbPath =
  process.env.BASE_DB_PATH ??
  userSettings.dbPath ??
  path.join(userDataPath, "app.db");

export const settings = { ...userSettings, ...{ dbPath } };
log.debug(settings);
