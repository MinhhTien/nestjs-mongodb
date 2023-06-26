import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/constants/enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({
    required: true,
    unique: true,
    type: String,
    index: true,
  })
  phone: string;

  @Prop({ required: true, unique: true, type: String, index: true })
  email: string;

  @Prop({ type: String, required: true, enum: Object.values(UserRole) })
  role: UserRole;

  @Prop({ default: true, select: false })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
