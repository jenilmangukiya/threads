import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import { prismaClient } from "./lib/db.js";

async function startServer() {
  const port = Number(process.env.PORT) || 8000;
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello(name:String): String
      }

      type Mutation {
        createUser(firstName: String!,lastName: String!, email: String!, password: String!): Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: (parent, { name }) => `Hey there ${name}!, how are you?`,
      },
      Mutation: {
        createUser: async (
          _,
          { firstName, lastName, email, password }: { [key: string]: string }
        ) => {
          await prismaClient.user.create({
            data: { email, firstName, lastName, password, salt: "salt" },
          });

          return true;
        },
      },
    },
  });

  await gqlServer.start();

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(port, () => {
    console.log("App is  listing on PORT: ", port);
  });
}

startServer();
