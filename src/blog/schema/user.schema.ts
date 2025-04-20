import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
    @Prop({ required: true })
    uid: string

    @Prop({ required: true })
    username: string

    @Prop({ required: true })
    first_name: string

    @Prop()
    middle_name?: string

    @Prop({ required: true })
    last_name: string

    @Prop()
    dp: string

    @Prop()
    bio: string

    @Prop({ required: true, type: Date })
    dob: Date

    @Prop({ required: true, type: Date })
    join_date: Date

    @Prop({ type: [ String ], default: [] })
    followers: string[]

    @Prop({ type: [ String ], default: [] })
    following: string[]

    @Prop()
    auth_id: string
}

export const UserSchema = SchemaFactory.createForClass(User)