import log from "electron-log";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "../../prismaClient";
import { settings } from "./settings";
import { migrate } from "./migration";
import { schema } from "./schema";

export type TemplateTask = {
  id: number;
  templateId: number;
  name: string;
  estimate?: number;
};

export enum Status {
  Normal = 0,
  Completed = 1,
  Archived = 2,
}

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
  }).start({
    port: 5164,
    subscriptions: false,
  });
  log.debug("Server is running");
})();
