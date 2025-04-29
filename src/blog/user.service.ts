import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schema/user.schema'
import { Post } from './schema/post.schema'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
    ) {}

    async getUserDetails(uid: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ uid }).exec()

            if (!user) {
                throw new BadRequestException('User not found')
            }

            return user
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }

    async createUser(
        username: string,
        first_name: string,
        middle_name: string | null,
        last_name: string,
        dob: Date,
        bio: string | null,
        dp: string | null
    ): Promise<User> {
        try {
            const user = await this.userModel.create({
                uid: uuidv4(),
                username,
                first_name,
                middle_name,
                last_name,
                bio,
                dp,
                dob,
                join_date: new Date()
            })
    
            return user
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }

    async updateUser(
        uid: string,
        username: string,
        first_name: string,
        middle_name: string | null,
        last_name: string,
        dob: Date,
        bio: string | null,
        dp: string | null
    ): Promise<User> {
        try {
            let user = await this.userModel.findOne({ uid })

            if (!user) {
                throw new BadRequestException('User not found')
            }

            await this.userModel.updateOne({ uid }, {
                username,
                first_name,
                middle_name,
                last_name,
                bio,
                dp,
                dob
            })

            user = await this.userModel.findOne({ uid })

            if (!user) {
                throw new BadRequestException('User not found')
            }

            this.updateUserPosts(user)
    
            return user
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }

    async updateUserPosts(user: User) {
        try {
            await this.postModel.updateMany({ uid: user.uid }, {
                username: user.username,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                dp: user.dp
            })
        } catch (err) {
            console.error('Error updating posts', err)
        }
    }

    async deleteUser(
        uid: string
    ): Promise<void> {
        try {
            let user = await this.userModel.findOne({ uid })

            if (!user) {
                throw new BadRequestException('User not found')
            }

            await this.userModel.deleteOne({ uid })
    
            return
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }

            throw new InternalServerErrorException('Something went wrong!')
        }
    }
}
