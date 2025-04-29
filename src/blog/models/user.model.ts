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
    middleName?: string | null

    @Field()
    lastName: string

    @Field({ nullable: true })
    bio?: string | null

    @Field({ nullable: true })
    dp?: string | null

    @Field(() => Date)
    dob: Date

    @Field(() => Date)
    joinedOn: Date

    @Field()
    followers: string[]

    @Field()
    following: string[]
}