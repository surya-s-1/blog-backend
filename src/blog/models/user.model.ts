import { Field, ObjectType } from '@nestjs/graphql'
import { Post } from './post.model'

@ObjectType()
export class User {
    @Field()
    userId: string

    @Field()
    username: string

    @Field()
    firstName: string

    @Field({ nullable: true })
    middleName?: string

    @Field()
    lastName: string

    @Field({ nullable: true })
    bio: string

    @Field(() => Date)
    dob: Date

    @Field(() => Date)
    joinedOn: Date

    @Field(() => [User], { nullable: 'items' })
    followers: User[]

    @Field(() => [User], { nullable: 'items' })
    following: User[]

    @Field(() => [Post], { nullable: 'items' })
    posts: Post[]
}