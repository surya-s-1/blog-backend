import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Post {
    @Field()
    postId: string

    @Field()
    content: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Boolean)
    public: Boolean

    @Field(() => [String])
    tags: string[]

    @Field({ nullable: true })
    userId?: string

    @Field({ nullable: true })
    username?: string

    @Field({ nullable: true })
    firstName?: string

    @Field({ nullable: true })
    middleName?: string

    @Field({ nullable: true })
    lastName?: string

    @Field({ nullable: true })
    dp?: string
}