import { IsString, IsNotEmpty} from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
