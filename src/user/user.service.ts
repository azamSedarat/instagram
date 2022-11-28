import mongoose, { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserData } from './types/user.type';
import * as fs from 'fs';
import { strict } from 'assert';
import { UserSchema } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private UserModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserData> {
    const createdUser = new this.UserModel(createUserDto);
    await createdUser.save();
    return this.getUserData(createdUser, 'private');
  }

  async findAll(): Promise<UserData[]> {
    return this.UserModel.find().exec();
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.UserModel.findOne({ username });
  }

  async editProfilePhoto(
    newPhoto: Express.Multer.File,
    user: User,
  ): Promise<string> {
    if (user['photo']) {
      fs.unlink(user['photo'], (err) => {
        if (err) {
          throw err;
        }
      });
    }
    user['photo'] = newPhoto.path;
    await user.save();
    return 'your Profile photo updated';
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    await this.UserModel.findOneAndUpdate(
      { username },
      { $set: updateUserDto },
    );
    return 'updated successfully';
  }

  async remove(user: User) {
    const doc = await this.UserModel.findOne({ username: user.username })
    await doc.deleteOne()
    await this.UserModel.updateMany({}, 
      {$pull: {followings: doc._id}}, 
      {multi: true})
    return "successfully deleted"
  }

  async removePostRef(user, postId) {
    return await this.UserModel.findOneAndUpdate({username:user.username},
      {$pull: {posts: postId}})
  }

  async addFollowing(id: string, user: User) {
    return this.UserModel.updateOne(
      { username: user.username },
      { $addToSet: { followings: { _id: id } } },
    );
    return `succeed`;
  }

  async removeFollowing(id: string, user: User) {
    const result = await this.UserModel.updateOne(
      { username: user.username },
      { $pull: {followings: id} },
    );
    return `succeed`;
  }

  async getPosts(user: User) {
    return await this.UserModel.find({ username: user.username })
      .select('username')
      .populate({
        path: 'followings',
        select: 'username',
        populate: {
          path: 'posts',
          select: 'photoOrVideo',
        },
      });
  }

  async isFollowing(targetUser: User, user: User): Promise<boolean> {
    const follower = await this.UserModel.findOne({ username: user.username });
    const isFollowing = follower.followings.includes(targetUser._id);
    if (isFollowing) {
      return true;
    } else {
      return false;
    }
  }

  getUserData(user, type: string): UserData {
    switch (type) {
      case 'public':
        return {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          Photo: user.Photo,
          bio: user.bio,
          followings: user.followings,
          posts: user.posts,
        };
      case 'private':
        return {
          id: user._id,
          mobileNumber: user.mobileNumber,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          Photo: user.Photo,
          privateStatus: user.privateStatus,
          gender: user.gender,
          birthDay: user.gender,
          pronouns: user.pronouns,
          bio: user.bio,
          followings: user.followings,
          posts: user.posts,
        };
      case 'limited':
        return {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          Photo: user.Photo,
          bio: user.bio,
        };
    }
  }
}
