import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {PostSchema} from "./schemas/post.schema"
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = './src/post/photo';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          cb(null,`${req.user.username}-${Date.now()}-${uuid()}-${extname(file.originalname)}`);
        }
      })
    }),
    MongooseModule.forFeature([{ name: "Post", schema: PostSchema }])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports:[PostService]
})
export class PostModule {}
