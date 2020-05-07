import os from "os";
import fs from "fs";
import path from "path";
import log from "electron-log";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { Sequelize } from "sequelize";
import { Umzug } from "umzug";
import { Resolvers } from "./generated/graphql";
import { PrismaClient, PrismaClientOptions } from "../../prismaClient";

interface Settings {
  dbPath?: string;
}

(async () => {
  const userDataPath = `${os.homedir()}/Library/Application Support/base`;
  const settingPath = path.join(userDataPath, "settings.json");

  try {
    fs.accessSync(settingPath);
  } catch (e) {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.writeFileSync(settingPath, "{}\n");
  }

  const settings: Settings = JSON.parse(fs.readFileSync(settingPath, "utf8"));
  log.debug(settings);

  const dbPath =
    process.env.BASE_DB_PATH ??
    settings.dbPath ??
    path.join(userDataPath, "app.db");
  log.debug(dbPath);

  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
  });
  const umzug = new Umzug({
    migrations: {
      path: path.join(__dirname, "./migrations"),
      params: [sequelize.getQueryInterface()],
    },
    storage: "sequelize",
    storageOptions: { sequelize },
  });
  await umzug.up();

  const typeDefs = importSchema(
    path.join(__dirname, "./generated/plan.graphql")
  );
  const resolvers: Resolvers = {
    Query: {
      tasks: (parent, args, ctx) => ctx.prisma.tasks.findMany(),
    },
    Mutation: {
      addTask: (parent, args, ctx) =>
        ctx.prisma.tasks.create({
          data: {
            name: args.name,
          },
        }),
      updateTask: (parent, args, ctx) =>
        ctx.prisma.tasks.update({
          where: { id: args.id },
          data: { name: args.name },
        }),
      deleteTask: (parent, args, ctx) =>
        ctx.prisma.tasks.delete({
          where: { id: args.id },
        }),
    },
  };

  const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
  });

  const prisma = new PrismaClient({
    datasources: {
      db: `file:${dbPath}`,
    },
  } as PrismaClientOptions);
  const createContext = () => ({ prisma });

  await new GraphQLServer({ schema, context: createContext }).start({
    port: 5164,
  });
})();
