import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Email, Localization, Role } from 'src/common/types/types';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false, id: false })
export class User {
  @Prop({ type: Object })
  username: Localization;
  @Prop({ required: true })
  password: string;
  @Prop({ type: Object })
  email: Email;
  @Prop({ unique: true })
  studentId: string;
  @Prop({ unique: true })
  userId: string;
  @Prop()
  tel: string;
  @Prop()
  photo: string;
  @Prop({ type: String, enum: Role, default: Role.STUDENT })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('arts', {
  ref: 'Art',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
