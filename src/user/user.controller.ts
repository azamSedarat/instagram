import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserData } from './types/user.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('photo')
  @UseInterceptors(FileInterceptor('photo'))
  async editProfilePhoto(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userObj = await this.userService.findOne(req.user.username);
    return await this.userService.editProfilePhoto(file, userObj);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserData> {
    const user = await this.userService.findOne(req.user.username);
    return this.userService.getUserData(user, 'private');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getOtherProfile(@Param('username') username: string, @Request() req) {
    const targetUser = await this.userService.findOne(username);
    const isFollwed = await this.userService.isFollowing(targetUser, req.user);
    if (!targetUser.privateStatus || isFollwed) {
      return this.userService.getUserData(targetUser, 'public');
    } else {
      return this.userService.getUserData(targetUser, 'limited');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  editProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Request() req) {
    return this.userService.remove(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  async follow(@Body('id') id: string, @Request() req) {
    try {
      await this.userService.addFollowing(id, req.user);
      return 'succeed';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow')
  async unfollow(@Body('id') id: string, @Request() req) {
    try {
      return await this.userService.removeFollowing(id, req.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }
}
