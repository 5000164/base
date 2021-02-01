import os from "os";
import fs from "fs";
import path from "path";
import { LogLevel } from "electron-log";

interface UserSettings {
  dbPath?: string;
  logLevel?: LogLevel;
}

export interface Settings {
  dbPath: string;
  logLevel: LogLevel;
}

const userDataPath = `${os.homedir()}/Library/Application Support/base`;
const settingPath = path.join(userDataPath, "settings.json");

try {
  fs.accessSync(settingPath);
} catch (e) {
  fs.mkdirSync(userDataPath, { recursive: true });
  fs.writeFileSync(settingPath, "{}\n");
}

const userSettings: UserSettings = JSON.parse(
  fs.readFileSync(settingPath, "utf8")
);

const dbPath =
  process.env.BASE_DB_PATH ??
  userSettings.dbPath ??
  path.join(userDataPath, "app.db");

const logLevel =
  (process.env.BASE_LOG_LEVEL as LogLevel) ?? userSettings.logLevel ?? "info";

export const settings: Settings = { dbPath, logLevel };
