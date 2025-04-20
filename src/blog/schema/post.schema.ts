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

    @Prop({ required: true, type: Boolean, default: true})
    public: Boolean

    @Prop({ default: [] })
    tags: string[]

    @Prop({ required: true })
    uid: string

    @Prop()
    username: string

    @Prop()
    first_name: string

    @Prop()
    middle_name: string

    @Prop()
    last_name: string

    @Prop()
    dp: string
}

export const PostSchema = SchemaFactory.createForClass(Post)