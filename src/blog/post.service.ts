import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from './schema/post.schema'

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<Post>
    ) {}

    async getHomeFeed(): Promise<Post[]> {
        return this.postModel.find().exec()
    }
}
