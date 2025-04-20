import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Post extends Document {
    @Prop({ required: true })
    pid: string

    @Prop({ required: true })
    content: string

    @Prop({ required: true, type: Date })
    created_at: Date

    @Prop({ required: true })
    owner: string
}

export const PostSchema = SchemaFactory.createForClass(Post)