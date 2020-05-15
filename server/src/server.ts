import path from "path";
import log from "electron-log";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { Resolvers } from "./generated/graphql";
import { PrismaClient, PrismaClientOptions } from "../../prismaClient";
import { settings } from "./settings";
import { migrate } from "./migration";

(async () => {
  await migrate({ dbPath: settings.dbPath });

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
      updateTask: (parent, args, ctx) => {
        const data = {
          ...(args.name ? { name: args.name } : {}),
          ...(args.estimate ? { estimate: args.estimate } : {}),
        };
        return ctx.prisma.tasks.update({
          where: { id: args.id },
          data,
        });
      },
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
      db: `file:${settings.dbPath}`,
    },
  } as PrismaClientOptions);
  const createContext = () => ({ prisma });

  await new GraphQLServer({ schema, context: createContext }).start({
    port: 5164,
  });
  log.debug("Server is running");
})();
