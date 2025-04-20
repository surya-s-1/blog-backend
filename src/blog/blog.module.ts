import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schema/user.schema'
import { Post, PostSchema } from './schema/post.schema'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/**/schema.gql'),
      sortSchema: true
    }),
    MongooseModule.forFeature([ 
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema }
    ])
  ],
})
export class BlogModule {}
