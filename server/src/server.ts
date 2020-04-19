const path = require("path");
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { Resolvers } from "./generated/graphql";

const typeDefs = importSchema(path.join(__dirname, "./generated/plan.graphql"));
const resolvers: Resolvers = {
  Query: {
    plan: () => ["勉強", "仕事", "漫画", "調べ物"],
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("Server is running on localhost:4000"));
