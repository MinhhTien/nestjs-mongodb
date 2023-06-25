import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { now, Document } from 'mongoose';
import { UserRole } from 'src/constants/enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  role: UserRole;

  @Prop()
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
