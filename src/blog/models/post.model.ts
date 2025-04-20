import { Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.model'

@ObjectType()
export class Post {
    @Field()
    id: string

    @Field()
    content: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => User, { nullable: 'items' })
    owner: User
}