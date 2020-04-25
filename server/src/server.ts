const path = require("path");
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { Resolvers } from "./generated/graphql";
import { PrismaClient } from "@prisma/client";

const typeDefs = importSchema(path.join(__dirname, "./generated/plan.graphql"));
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
  },
};

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const prisma = new PrismaClient();
const createContext = () => ({ prisma });

new GraphQLServer({ schema, context: createContext }).start(() =>
  console.log("Server is running on localhost:4000")
);
