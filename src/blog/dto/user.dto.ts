import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class DeleteUserResponse {
  @Field()
  success: boolean
}