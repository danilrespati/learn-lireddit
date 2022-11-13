import { MikroORM, RequestContext } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  await RequestContext.createAsync(orm.em, async () => {
    // const post = orm.em.create(Post, { title: "my new post" });
    // console.log(post);
    // await orm.em.persistAndFlush(post);
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);
  });
};

main().catch((err) => {
  console.error(err);
});
