import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schema/user.schema'
import { Post, PostSchema } from './schema/post.schema'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'
import { UserService } from './user.service'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/blog/schema.gql'),
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        return {
          message: error?.message,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            status: error.extensions?.status || (error.extensions?.originalError as { statusCode: number })?.statusCode || 500,
          },
        }
      }
    }),
    MongooseModule.forFeature([ 
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema }
    ])
  ],
  providers: [ 
    PostResolver,
    PostService,
    UserService
  ]
})
export class BlogModule {}
