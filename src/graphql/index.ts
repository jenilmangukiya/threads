import { ApolloServer } from "@apollo/server";
import { user } from "./user/index.js";

export const createGqlServer = async () => {
  const gqlServer = new ApolloServer({
    typeDefs: `
          ${user.typeDef}
          type Query {
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
