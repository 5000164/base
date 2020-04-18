import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    plan: [String!]!
  }
`;

const resolvers = {
  Query: {
    plan: (_: any) => ["勉強", "仕事", "漫画", ""],
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("Server is running on localhost:4000"));
