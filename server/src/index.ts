import express from "express";
import { ApolloServer } from "@apollo/server";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import { __prod__ } from "./constants";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { json } from "body-parser";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
  });
  await server.start();

  //apply mikro ORM RequestContext helper (https://mikro-orm.io/docs/identity-map)
  app.use((_req, _res, next) => {
    RequestContext.create(orm.em, next);
  });

  //apply graphql to server
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({ credentials: true }),
    json(),
    expressMiddleware(server, {
      context: async () => ({ em: orm.em }),
    })
  );

  app.get("/", async (_req, res) => {
    res.send("nothing to see here");
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
