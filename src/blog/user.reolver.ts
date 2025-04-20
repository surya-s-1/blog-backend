import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './models/user.model'
import { User as UserDocument } from './schema/user.schema'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
    constructor(
        private userService: UserService
    ) {}

    prepareUserForGqlResponse(user: UserDocument): User {
        const formatted_user: User = {
            userId: user.uid,
            username: user.username,
            firstName: user.first_name,
            middleName: user.middle_name,
            lastName: user.last_name,
            bio: user.bio,
            dob: user.dob,
            dp: user.dp,
            joinedOn: user.join_date
        }

        return formatted_user
    }

    @Query(() => User, { name: 'getUserDetails' })
    async getUserDetails(): Promise<User> {
        const user = await this.userService.getUserDetails('ea73b31e-ccab-4115-8143-1676fb7ef8a7')
        return this.prepareUserForGqlResponse(user)
    }

    @Mutation(() => User, { name: 'createUser' })
    async createUser(
        @Args('username') username: string,
        @Args('first_name') first_name: string,
        @Args('middle_name', { nullable: true }) middle_name: string,
        @Args('last_name') last_name: string,
        @Args('dob') dob: Date,
        @Args('bio', { nullable: true }) bio: string,
        @Args('dp', { nullable: true }) dp: string
    ): Promise<User> {
        const user: UserDocument = await this.userService.createUser(username, first_name, middle_name, last_name, dob, bio, dp)

        const result: User = this.prepareUserForGqlResponse(user)

        return result
    }
}