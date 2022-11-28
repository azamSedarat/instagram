import { IsString, IsNotEmpty, IsEmail, IsMobilePhone, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsOptional()
    email : string;

    @IsMobilePhone()
    @IsOptional()
    mobileNumber : string;

    @IsString()
    @IsNotEmpty()
    fullName : string;

    @IsString()
    @IsNotEmpty()
    username : string;

    @MinLength(8, {message: 'password is too short'})
    @IsString()
    @IsNotEmpty()
    password : string;
}
