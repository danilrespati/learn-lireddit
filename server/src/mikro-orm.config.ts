import { defineConfig } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

export default defineConfig({
  migrations: {
    path: "dist/migrations", // path to the folder with migrations
    pathTs: "src/migrations", // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
  },
  entities: [Post], // no need for `entitiesTs` this way
  type: "postgresql",
  dbName: "lireddit",
  password: "postgres",
  debug: !__prod__,
});
