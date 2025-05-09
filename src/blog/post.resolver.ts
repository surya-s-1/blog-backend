import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Post } from './models/post.model'
import { Post as PostDocument } from './schema/post.schema'
import { User as UserDocument } from './schema/user.schema'
import { PostService } from './post.service'
import { UserService } from './user.service'
import { DeletePostResponse, HomeFeedResponse, UserOwnedPostsResponse } from './dto/post.dto'

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private postService: PostService,
        private userService: UserService
    ) {}

    async preparePostForGqlResponse(post: PostDocument): Promise<Post> {
        /* If all the minimun details exist, return the post */
        if (post.username && post.first_name && post.last_name) {
            return {
                postId: post.pid,
                content: post.content,
                createdAt: post.created_at,
                public: post.public,
                tags: post.tags,
                userId: post.uid,
                username: post.username,
                firstName: post.first_name,
                middleName: post.middle_name,
                lastName: post.last_name,
                dp: post.dp
            }
        /* Else, query the db for the user data and then return the post */
        } else {
            const user: UserDocument | null = await this.userService.getUserDetails(post.uid)

            return {
                postId: post.pid,
                content: post.content,
                createdAt: post.created_at,
                public: post.public,
                tags: post.tags,
                userId: user?.uid,
                username: user?.username,
                firstName: user?.first_name,
                middleName: user?.middle_name,
                lastName: user?.last_name,
                dp: user?.dp
            }
        }
    }

    @Query(() => HomeFeedResponse, { name: 'getHomeFeed' })
    async getHomeFeed(
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
        @Args('cursor', { type: () => Date, nullable: true }) cursor?: Date,
    ): Promise<HomeFeedResponse> {
        const posts: PostDocument[] = await this.postService.getHomeFeed(limit, cursor)

        const result: Post[] = []

        posts.slice(0, limit).forEach(async (po) => {
            const formatted_post: Post = await this.preparePostForGqlResponse(po)
            result.push(formatted_post)
        })

        const nextCursor = posts.length > limit ? new Date(posts[limit - 1].created_at) : null

        return {
            posts: result,
            nextCursor
        }
    }

    @Query(() => UserOwnedPostsResponse, { name: 'getUserOwnedPosts' })
    async getUserOwnedPosts(
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
        @Args('cursor', { type: () => Date, nullable: true }) cursor?: Date
    ): Promise<UserOwnedPostsResponse> {
        const posts: PostDocument[] = await this.postService.getUserOwnedPosts('ea73b31e-ccab-4115-8143-1676fb7ef8a7', limit, cursor)

        const result: Post[] = []

        posts.slice(0, limit).forEach(async (po) => {
            const formatted_post: Post = await this.preparePostForGqlResponse(po)
            result.push(formatted_post)
        })

        const nextCursor = posts.length > limit ? new Date(posts[limit - 1].created_at) : null

        return {
            posts: result,
            nextCursor
        }
    }

    @Query(() => Post, { name: 'getPost' })
    async getPost(
        @Args('postId') pid: string
    ): Promise<Post> {
        const post: PostDocument = await this.postService.getPost(pid)

        const result: Post = await this.preparePostForGqlResponse(post)

        return result
    }

    @Mutation(() => Post, { name: 'createPost' })
    async createPost(
        @Args('content') content: string,
        @Args('tags', { type: () => [String] }) tags: string[],
        @Args('public', { type: () => Boolean }) visibility: boolean
    ): Promise<Post> {
        const post: PostDocument = await this.postService.createPost(content, tags, visibility, 'ea73b31e-ccab-4115-8143-1676fb7ef8a7')

        const result: Post = await this.preparePostForGqlResponse(post)

        return result
    }

    @Mutation(() => Post, { name: 'updatePost' })
    async updatePost(
        @Args('content') content: string, 
        @Args('tags', { type: () => [String] }) tags: string[],
        @Args('public', { type: () => Boolean }) visibility: Boolean,
        @Args('postId') pid: string
    ): Promise<Post> {
        const post: PostDocument = await this.postService.updatePost(content, tags, visibility, pid, 'ea73b31e-ccab-4115-8143-1676fb7ef8a7')

        const result: Post = await this.preparePostForGqlResponse(post)

        return result
    }

    @Mutation(() => DeletePostResponse, { name: 'deletePost' })
    async deletePost(
        @Args('postId') pid: string
    ): Promise<DeletePostResponse> {
        await this.postService.deletePost(pid, 'ea73b31e-ccab-4115-8143-1676fb7ef8a7')

        return {
            success: true
        }
    }
}