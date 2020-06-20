import log from "electron-log";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient, PrismaClientOptions } from "../../prismaClient";
import { settings } from "./settings";
import { migrate } from "./migration";
import { schema } from "./schema";

export enum Status {
  Normal = 0,
  Completed = 1,
  Archived = 2,
}

(async () => {
  await migrate({ dbPath: settings.dbPath });

  const prisma = new PrismaClient({
    datasources: {
      db: `file:${settings.dbPath}`,
    },
  } as PrismaClientOptions);
  const createContext = () => ({ prisma });

  await new GraphQLServer({ schema, context: createContext }).start({
    port: 5164,
  });
  log.debug("Server is running");
})();
