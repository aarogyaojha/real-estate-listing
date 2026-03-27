import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'aarogyaojha', minLength: 3 })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'Admin@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
