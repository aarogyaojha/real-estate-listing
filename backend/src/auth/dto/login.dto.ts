import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'aarogyaojha' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  password: string;
}
