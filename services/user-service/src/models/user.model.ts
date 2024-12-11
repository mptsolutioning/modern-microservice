import mongoose, { Schema } from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  provider: 'local' | 'google' | 'github';
  providerId?: string;
  roles: string[];
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  firstName: String,
  lastName: String,
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  providerId: String,
  roles: {
    type: [String],
    default: ['user']
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);