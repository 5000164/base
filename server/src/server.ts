import log from "electron-log";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "../../prismaClient"; // Electron の asar 内から呼び出すことができないため、arar の外に置いた時に相対的にパスが一致するようにする
import { settings } from "./settings";
import { migrate } from "./migration";
import { schema } from "./schema";

log.transports.file.level = settings.logLevel;
const date = new Date();
const prefix = [
  date.getFullYear().toString().padStart(4, "0"),
  (date.getMonth() + 1).toString().padStart(2, "0"),
  date.getDate().toString().padStart(2, "0"),
].join("");
const fileName = log.transports.file.fileName;
log.transports.file.fileName = `${prefix}_${fileName}`;

process.on("SIGINT", () => {
  log.error("Received SIGINT");
  process.exit();
});

process.on("uncaughtException", (err) => {
  log.error(`Caught exception: ${err}`);
});

process.on("unhandledRejection", (reason, p) => {
  log.error(`Unhandled Rejection at: ${p}, reason: ${reason}`);
});

log.debug(settings);

(async () => {
  await migrate({ dbPath: settings.dbPath });

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${settings.dbPath}`,
      },
    },
  });
  const createContext = () => ({ prisma });

  await new GraphQLServer({
    schema,
    context: createContext,
  })
    .start({
      port: process.env.BASE_PORT ?? 5164,
      subscriptions: false,
    })
    .catch((e) => log.error(e));

  log.debug("Server is running");
})();
