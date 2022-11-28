import { Controller, Get, Request, Post, Body, Put, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from 'src/user/user.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private userService: UserService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('postFile', 10))
  async addPost(
    @Request() req,
    @Body() body: CreatePostDto,
    @UploadedFiles() postFiles: Array<Express.Multer.File>
  ) {
    return await this.postService.createPost(req.user.username, body, postFiles);
  }

  @Put(':postId')
  updatePost(@Param('postId') postId: string, @Body() updatePostDto: UpdatePostDto,@Request() req) {
    return this.postService.updatePost(postId, updatePostDto, req.user);
  }

  @Get(':postId')
  findOnePost(@Param('postId') postId: string) {
    return this.postService.findOnePost(postId);
  }

  @Delete(':postId')
  removePost(@Request() req, @Param('postId') postId: string) {
    return this.postService.removePost(req.user, postId);
  }

  @Get()
  getfollowingPost(@Request() req) {
    return this.userService.getPosts(req.user);
  }

  @Post('like/:postId')
  async likePost(@Param("postId") postId: string, @Request() req) {
    return await this.postService.addlikeToPost(postId, req.user.userId);
  }

  @Get('like/:postId')
  async getPostLike(@Param("postId") postId: string) {
    return await this.postService.getPostLikes(postId);
  }

  @Delete('like/:postId')
  async disLikePost(@Param("postId") postId: string, @Request() req) {
    return await this.postService.dislikePost(postId, req.user.userId);
  }

  @Post('comment/:postId')
  async addComment(@Param("postId") postId: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    return await this.postService.addCommentToPost(postId, createCommentDto, req.user.username);
  }

  @Delete('comment/:commentId')
  removeComment(@Request() req, @Param('commentId') commentId: string) {
      return this.postService.removeOneComment(req.user.username, commentId);
   }

  @Get('comment/:postId')
  async getOneComment(@Param("postId") postId: string) {
    return await this.postService.getComments(postId);
  }

  @Post('comment/like/:commentId')
  async addCommentLike(@Param("commentId") commentId: string, @Request() req) {
    return await this.postService.addlikeToComment(commentId, req.user.username);
  }

  @Delete('comment/like/:commentId')
  async disLikeComment(@Param("commentId") commentId: string, @Request() req) {
    return await this.postService.dislikeComment(commentId, req.user.username);
  }

  @Post('comment/reply/:commentId')
  async addReply(@Param("commentId") commentId: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    return await this.postService.addReplyComment(commentId, createCommentDto, req.user.username);
  }
}
