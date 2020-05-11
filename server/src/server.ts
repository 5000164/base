import os from "os";
import fs from "fs";
import path from "path";
import log from "electron-log";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { Sequelize } from "sequelize";
import { migrationsList, Umzug } from "umzug";
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
    storage: "sequelize",
    storageOptions: { sequelize },
    migrations: migrationsList([
      {
        name: "00-create-tasks-table",
        async up() {
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id   INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL
              );
          `);
        },
        async down() {
          sequelize.query(`
              DROP TABLE tasks;
          `);
        },
      },
      {
        name: "01-add-status-column-to-tasks-table",
        async up() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id     INTEGER PRIMARY KEY AUTOINCREMENT,
                  name   TEXT    NOT NULL,
                  status INTEGER NOT NULL
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status)
              SELECT id, name, 0 AS status
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
        async down() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id   INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name)
              SELECT id, name
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
      },
    ]),
  });
  await umzug.up();

  const typeDefs = importSchema(
    path.join(__dirname, "./generated/plan.graphql")
  );
  const resolvers: Resolvers = {
    Query: {
      tasks: (parent, args, ctx) =>
        ctx.prisma.tasks.findMany({ where: { status: 0 } }),
    },
    Mutation: {
      addTask: (parent, args, ctx) =>
        ctx.prisma.tasks.create({
          data: {
            name: args.name,
            status: 0,
          },
        }),
      updateTask: (parent, args, ctx) =>
        ctx.prisma.tasks.update({
          where: { id: args.id },
          data: { name: args.name },
        }),
      completeTask: (parent, args, ctx) =>
        ctx.prisma.tasks.update({
          where: { id: args.id },
          data: { status: 1 },
        }),
      archiveTask: (parent, args, ctx) =>
        ctx.prisma.tasks.update({
          where: { id: args.id },
          data: { status: 2 },
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
