import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './types/post.type';
import { UserService } from 'src/user/user.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/user/types/user.type';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private PostModel: Model<Post>,
    private userService: UserService) {}

  async createPost(
    username: string, 
    createPostDto:CreatePostDto,
    postFiles:Array<Express.Multer.File>
    ) {
      const owner = await this.userService.findOne(username);
      const createdPost = new this.PostModel(createPostDto);
      createdPost.owner = owner._id;
      postFiles.forEach(element => {
        createdPost.photoOrVideo.push(element.path)
      });
      await createdPost.save();
      owner.posts.push(createdPost._id)
      owner.save();
      return createdPost;
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto, user:User) {
    const post = await this.PostModel.findById(postId)
    if(post.owner !== user.id){
      return "you dont have permission"
    }
    await this.PostModel.findByIdAndUpdate(postId, { $set: updatePostDto})
    return "updated successfully"
  }

  async findOnePost(postId: string): Promise<Post|undefined> {
    return this.PostModel.findById(postId)
  }

  async removePost(user:User, postId:string) {
    await this.PostModel.findByIdAndDelete(postId)
    await this.userService.removePostRef(user,postId)
    return "successfully deleted"
  }

  async addlikeToPost(postId:string , userId:string){
    await this.PostModel.findByIdAndUpdate(postId,
      {$addToSet: { likes: { _id: userId } }})
      return `succeed`
  }

  async getPostLikes(postId:string){
    return await this.PostModel.findOne({ _id: postId }).select("likes").
    populate({
      path: 'likes',
      select: 'username'
    }).exec();
  }

  async dislikePost(postId:string , userId:string){
    const result = await this.PostModel.updateOne(
      { _id: postId },
      { $pull: {likes: userId} },
    );
    return `succeed`;
  }

  async addCommentToPost(postId,createCommentDto:CreateCommentDto, username:string){
    const post = await this.PostModel.findById(postId)
    const owner = await this.userService.findOne(username)
    const newComment = {owner:owner._id, text:createCommentDto.text, time:new Date}
    post.comments.push(newComment)
    post.save();
    return `succeed`
  }

  async removeOneComment(username:string, commentId:string) {
    const owner = await this.userService.findOne(username)
    const res = await this.PostModel.updateOne(
      {'comments._id': commentId,
      'comments.owner': owner
    },
      {$pull: {comments:{_id: commentId}}})
    if(!res.matchedCount){
      return "there is no such file or you have not permission"
    }else{
      return "deleted successfully"
    }
  }

  async getComments(postId:string){
    return await this.PostModel.findOne({ _id: postId }).select("comments").
    populate({
      path: 'comments',
      select: 'text'
    }).
    populate({
      path: 'replies',
      select: 'text'
    }).exec()
  }

  async addlikeToComment(commentId:string , username:string){
    const owner = await this.userService.findOne(username)
    await this.PostModel.updateOne(
      {'comments._id': commentId},
      {$push: {'comments.$.likes': owner._id}})
      return 'liked!';
  }
  
  async dislikeComment(commentId:string , username:string){
    const owner = await this.userService.findOne(username)
    await this.PostModel.updateOne(
      {'comments._id': commentId},
      {$pull: {'comments.$.likes': owner._id}})
      return 'disliked!';
  }

  async addReplyComment(commentId,createCommentDto:CreateCommentDto, username:string){
    const owner = await this.userService.findOne(username)
    const reply = {owner:owner._id, text:createCommentDto.text, time:new Date}
    await this.PostModel.updateOne(
      {'comments._id': commentId},
      {$push: {'comments.$.replies': reply}})
    return 'updated!';
  }
}
