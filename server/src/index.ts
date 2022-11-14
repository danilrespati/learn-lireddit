import express from "express";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import { __prod__ } from "./constants";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { json } from "body-parser";
import { PostResolver } from "./resolvers/post";
import cors from "cors";
import { Post } from "./entities/Post";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
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
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async () => ({ em: orm.em }),
    })
  );

  app.get("/", async (_req, res) => {
    const posts = await orm.em.find(Post, {});
    res.send(posts);
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
