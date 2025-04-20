import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Post } from './schema/post.schema'
import { User } from './schema/user.schema'

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async getHomeFeed(limit: number, cursor: Date | undefined): Promise<Post[]> {
        const query: any = {}

        if (cursor) {
            return this.postModel
                    .find({ created_at: { $lt: new Date(cursor) }})
                    .sort({ created_at: -1 })
                    .limit(limit + 1)
                    .exec()
        } else {
            return this.postModel
                    .find()
                    .sort({ created_at: -1 })
                    .limit(limit + 1)
                    .exec()
        }        
    }

    async getUserOwnedPosts(uid: string): Promise<Post[]> {
        return this.postModel.find({ uid }).exec()
    }

    async getPost(pid: string): Promise<Post> {
        try {
            const post = await this.postModel.findOne({ pid }).exec()

            if (!post) {
                throw new BadRequestException('Post not found')
            }

            return post
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }

    async createPost(
        content: string,
        tags: string[],
        visibility: boolean,
        uid: string
    ): Promise<Post> {
        try {
            if (!content || !uid) {
                throw new BadRequestException('Bad Request')
            }
    
            const user = await this.userModel.findOne({ uid })
    
            if (!user) {
                throw new BadRequestException('User not found')
            }
    
            const post = await this.postModel.create({
                pid: uuidv4(),
                content: content,
                tags: tags,
                public: visibility,
                created_at: new Date(),
                uid: uid,
                username: user.username,
                dp: user.dp,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name
            })
    
            return post
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }

    async updatePost(
        content: string,
        tags: string[],
        visibility: boolean,
        pid: string, 
        uid: string
    ): Promise<Post> {
        try {
            if (!content || !uid || !pid) {
                throw new BadRequestException('Bad Request')
            }
    
            let post = await this.postModel.findOne({ pid, uid })
            const user = await this.userModel.findOne({ uid })
    
            if (!user || !post) {
                throw new ForbiddenException('User or Post not found')
            }
    
            await this.postModel.updateOne({ pid, uid }, {
                content: content,
                tags: tags,
                public: visibility,
                username: user.username,
                dp: user.dp,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name
            })

            post = await this.postModel.findOne({ pid, uid })

            if (!user || !post) {
                throw new ForbiddenException('User or Post not found')
            }
    
            return post
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }

    async deletePost(
        pid: string, 
        uid: string
    ): Promise<void> {
        try {
            if (!uid || !pid) {
                throw new BadRequestException('Bad Request')
            }
    
            const post = await this.postModel.findOne({ pid, uid })
    
            if (!post ) {
                throw new ForbiddenException('User or Post not found')
            }
    
            await this.postModel.deleteOne({ pid })
    
            return
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }
}
