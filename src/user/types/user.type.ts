import { Document, ObjectId } from 'mongoose';

export class User extends Document {
  id: string;
  mobileNumber?: string;
  email?: string;
  fullName: string;
  username: string;
  password?: string;
  Photo: string;
  privateStatus?: boolean;
  gender?: string;
  birthDay?: Date;
  pronouns?: string;
  bio: string;
  followings?: Array<ObjectId>;
  posts?: Array<ObjectId>;
}

export class UserData {
  id: string;
  mobileNumber?: string;
  email?: string;
  fullName: string;
  username: string;
  Photo: string;
  privateStatus?: boolean;
  gender?: string;
  birthDay?: Date;
  pronouns?: string;
  bio: string;
  followings?: Array<ObjectId>;
  posts?: Array<ObjectId>;
};