import { ApolloServer } from "@apollo/server";
import { user } from "./user/index.js";

export const createGqlServer = async () => {
  const gqlServer = new ApolloServer({
    typeDefs: `
          type Query {
            hello: String
            ${user.queries}
          }

          type Mutation {
            ${user.mutations}
          }
        `,
    resolvers: {
      Query: {
        ...user.resolvers.queries,
      },
      Mutation: {
        ...user.resolvers.mutations,
      },
    },
  });

  await gqlServer.start();

  return gqlServer;
};
