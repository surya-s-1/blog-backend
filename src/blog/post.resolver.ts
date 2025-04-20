import { Query, Resolver } from '@nestjs/graphql'
import { Post } from './models/post.model'
import { Post as PostDocument } from './schema/post.schema'
import { User as UserDocument } from './schema/user.schema'
import { PostService } from './post.service'
import { UserService } from './user.service'

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private postService: PostService,
        private userService: UserService
    ) {}

    @Query(() => [Post], { name: 'getHomeFeed' })
    async getHomeFeed(): Promise<Post[]> {
        const posts: PostDocument[] = await this.postService.getHomeFeed()

        const result: Post[] = []
        
        posts.forEach(async (p) => {
            const user: UserDocument | null = await this.userService.getUserDetails(p.uid)

            result.push({
                pid: p.pid,
                content: p.content,
                createdAt: p.created_at,
                uid: user?.uid,
                username: user?.u_name,
                firstName: user?.f_name,
                middleName: user?.m_name,
                lastName: user?.l_name,
                dp: user?.dp
            })
        })

        return result
    }

}