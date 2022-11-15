import { hash } from "argon2";
import { MyContext } from "src/types";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entities/User";

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => Boolean)
  async register(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    if (await em.findOne(User, { username: username })) {
      return false;
    }
    const hashedPassword = await hash(password);
    const user = em.create(User, {
      username: username,
      password: hashedPassword,
    });
    em.flush();
    console.log(user);
    return true;
    // return {
    //   username: "dummy",
    //   password: "dummy",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   id: 10,
    // };
  }
}

// @Mutation(() => Post)
//   async createPost(
//     @Arg("title", () => String) title: string,
//     @Ctx() { em }: MyContext
//   ): Promise<Post> {
//     const post = em.create(Post, { title: title });
//     await em.flush();
//     return post;
//   }
