import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Username of the user' })
  userName?: string;

  @ApiPropertyOptional({ description: 'Password of the user' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: ['admin', 'user'],
  })
  role?: 'admin' | 'user';
}
