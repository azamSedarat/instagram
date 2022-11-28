import { IsString, IsOptional} from 'class-validator';
import { ObjectId } from 'mongoose';
import { User } from 'src/user/types/user.type';

export class CreatePostDto {
    @IsString()
    @IsOptional()
    caption: string;

    @IsString({each: true})
    @IsOptional()
    taggedpeople: Array<ObjectId>;

    @IsString()
    @IsOptional()
    location: string;
}
