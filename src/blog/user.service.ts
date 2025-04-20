import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schema/user.schema'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
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
}
