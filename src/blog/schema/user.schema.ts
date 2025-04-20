import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
    @Prop({ required: true })
    uid: string

    @Prop({ required: true })
    u_name: string

    @Prop({ required: true })
    f_name: string

    @Prop()
    m_name?: string

    @Prop({ required: true })
    l_name: string

    @Prop()
    dp: string

    @Prop()
    bio: string

    @Prop({ required: true, type: Date })
    dob: Date

    @Prop({ required: true, type: Date })
    j_date: Date

    @Prop({ type: [ String ], default: [] })
    followers: string[]

    @Prop({ type: [ String ], default: [] })
    following: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)