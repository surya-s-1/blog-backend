import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Post {
    @Field()
    pid: string

    @Field()
    content: string

    @Field(() => Date)
    createdAt: Date

    @Field({ nullable: true })
    uid?: string

    @Field({ nullable: true })
    firstName?: string

    @Field({ nullable: true })
    middleName?: string

    @Field({ nullable: true })
    lastName?: string

    @Field({ nullable: true })
    dp?: string

    @Field({ nullable: true })
    username?: string
}