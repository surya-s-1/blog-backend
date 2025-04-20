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
    bio?: string

    @Field({ nullable: true })
    dp?: string

    @Field(() => Date)
    dob: Date

    @Field(() => Date)
    joinedOn: Date
}