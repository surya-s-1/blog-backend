import { ObjectType, Field } from '@nestjs/graphql'
import { Post } from '../models/post.model'

@ObjectType()
export class HomeFeedResponse {
  @Field(() => [Post])
  posts: Post[]

  @Field(() => Date, { nullable: true })
  nextCursor: Date | null
}

@ObjectType()
export class DeletePostResponse {
  @Field()
  success: boolean
}