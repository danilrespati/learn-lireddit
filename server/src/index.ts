import { MikroORM, RequestContext } from "@mikro-orm/core";
import express from "express";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  //mikro ORM RequestContext helper (https://mikro-orm.io/docs/identity-map)
  app.use((_req, _res, next) => {
    RequestContext.create(orm.em, next);
  });

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
