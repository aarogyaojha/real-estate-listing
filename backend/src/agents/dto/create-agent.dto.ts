import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ example: 'John Doe', description: 'Agent full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Agent email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: '0412345678',
    description: 'Agent phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Grand Realty', description: 'Agency name' })
  @IsString()
  @IsNotEmpty()
  agencyName: string;

  @ApiPropertyOptional({
    example: 'Senior agent with 10 years experience.',
    description: 'Agent biography',
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
