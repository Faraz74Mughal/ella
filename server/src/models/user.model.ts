import mongoose, { Document, Schema } from 'mongoose';
import { IExtendedUser, EUserRole } from '../interface/userInterface';
import bcrypt from 'bcryptjs';

const collectionName = 'User';

const schema = new Schema<IExtendedUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [3, 'First name must be at least 3 characters long'],
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [3, 'Last name must be at least 3 characters long'],
    },

    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: [true, 'Email must be unique.'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: (props: { value: string }) => `${props.value} is not valid email address.`,
      },
    },

    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long.'],
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid password. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
      },
      select: false,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(EUserRole),
      required: [true, 'Role is required.'],
      default: EUserRole.STUDENT,
    },
    isApprove: {
      type: Boolean,
      default: true,
      required: [true, 'User status is required.'],
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: [true, 'Verification is required.'],
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: unknown, ret) => {
        delete (ret as { password?: string }).password;
        delete (ret as { verificationTokenExpiry?: Date }).verificationTokenExpiry;
        delete (ret as { verificationToken?: string }).verificationToken;
        delete (ret as { refreshToken?: string }).refreshToken;
        return ret;
      },
    },
  }
);

// Hash password before saving
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

// Compare password method
schema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IExtendedUser>(collectionName, schema);
