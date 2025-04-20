import { Resolver } from '@nestjs/graphql'
import { Post } from './models/post.model';
import { PostsService } from './posts.service';

@Resolver(() => Post)
export class PostsResolver {
    constructor(
        private postsService: PostsService
    ) {}
}