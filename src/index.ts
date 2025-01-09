import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createGqlServer } from "./graphql/index.js";
import UserService from "./services/user.js";

async function startServer() {
  const port = Number(process.env.PORT) || 8000;
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(
    "/graphql",
    expressMiddleware(await createGqlServer(), {
      context: async ({ req, res }) => {
        const token = req.headers["token"];

        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(port, () => {
    console.log("App is  listing on PORT: ", port);
  });
}

startServer();
