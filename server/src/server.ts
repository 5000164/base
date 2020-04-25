const path = require("path");
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { Resolvers } from "./generated/graphql";
import { PrismaClient } from "@prisma/client";

const typeDefs = importSchema(path.join(__dirname, "./generated/plan.graphql"));
const resolvers: Resolvers = {
  Query: {
    tasks: async (parent, args, ctx) => ctx.prisma.tasks.findMany(),
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
