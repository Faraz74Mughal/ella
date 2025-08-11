import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../types";
import bcrypt from "bcryptjs"

const collectionName = "User";

export interface IUser extends Document {
  _id:string;
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  role:UserRole;
  profilePicture:string;
  isActive:boolean;
  lastLogin?:Date;
  createdAt:Date;
  updatedAt:Date;
  comparePassword(candidatePassword:string):Promise<boolean>
}


const schema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [3, "First name must be at least 3 characters long"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [3, "Last name must be at least 3 characters long"]
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email must be unique."],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props: { value: string }) =>
        `${props.value} is not valid email address.`
    }
  },

  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must be at least 8 characters long."],
    validate: {
      validator: function (value: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid password. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`
    },
    select:false
  },
  profilePicture: {
    type: String
  },
  role: {
    type:String,
    enum:Object.values(UserRole),
    required:[true,"Role is required."],
    default:UserRole.STUDENT

  },
  isActive: {
    type: Boolean,
    default: false,
    required: [true, "User status is required."]
  },
  lastLogin: {
    type: Date,
    default: null
  }
},{
  timestamps:true,
  toJSON:{
    transform:(doc,ret)=>{
      delete (ret as {password?:string}).password;
      return ret

    }
  },
});


// Hash password before saving
schema.pre('save',async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password,12)
  next()
})

// Compare password method
schema.methods.comparePassword = async function (candidatePassword:string): Promise<boolean>{
  return bcrypt.compare(candidatePassword,this.password)
}

export const User = mongoose.model<IUser>(collectionName,schema)