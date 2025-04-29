import { Field, ObjectType } from '@nestjs/graphql'

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

    @Field(() => [String])
    followers: string[]

    @Field(() => [String])
    following: string[]
}