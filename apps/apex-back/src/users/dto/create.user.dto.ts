import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  userName: string;

  @ApiProperty({ description: 'Password of the user' })
  password: string;

  @ApiProperty({ description: 'Role of the user', enum: ['admin', 'user'] })
  role: 'admin' | 'user';

  @ApiPropertyOptional({ description: 'Date when the user was created' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Date when the user was last updated' })
  updatedAt?: Date;
}
