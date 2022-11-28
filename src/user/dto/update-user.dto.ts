import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsBoolean()
    @IsOptional()
    private: boolean;
   
    @IsEnum({male:'male', female:'female'})
    @IsOptional()
    gender: string;

    @IsDateString()
    @IsOptional()
    birthDay: Date;
    
    @IsString()
    @IsOptional()
    pronouns: string;

    @IsString()
    @IsOptional()
    bio: string;
}
