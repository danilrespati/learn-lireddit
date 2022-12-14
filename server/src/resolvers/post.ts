import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  async getPosts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return await em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async getPost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return await em.findOne(Post, { id: id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title: title });
    await em.flush();
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id: id });
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const post = await em.findOne(Post, { id: id });
    if (!post) {
      return false;
    }

    await em.removeAndFlush(post);

    return true;
  }
}
