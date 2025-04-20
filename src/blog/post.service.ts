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

    async getHomeFeed(): Promise<Post[]> {
        return this.postModel.find().exec()
    }

    async getUserOwnedPosts(uid: string): Promise<Post[]> {
        return this.postModel.find({ uid }).exec()
    }

    async getPost(pid: string): Promise<Post> {
        try {
            const post = await this.postModel.findOne({ pid }).exec()

            if (!post) {
                throw new BadRequestException('Bad Request')
            }

            return post
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Internal Server Error')
        }
    }

    async createPost(
        content: string, 
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

            throw new InternalServerErrorException('Internal Server Error')
        }
    }

    async updatePost(
        content: string, 
        pid: string, 
        uid: string
    ): Promise<Post> {
        try {
            if (!content || !uid || !pid) {
                throw new BadRequestException('Bad Request')
            }
    
            const post = await this.postModel.findOne({ pid, uid })
            const user = await this.userModel.findOne({ uid })
    
            if (!user || !post) {
                throw new ForbiddenException('Forbidden')
            }
    
            await this.postModel.updateOne({ pid, uid }, {
                content: content,
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

            throw new InternalServerErrorException('Internal Server Error')
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
                throw new ForbiddenException('Forbidden')
            }
    
            await this.postModel.deleteOne({ pid })
    
            return
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Internal Server Error')
        }
    }
}
