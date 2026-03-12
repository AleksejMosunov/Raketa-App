import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/schemas/user.schema';

interface JwtPayload {
  sub: string;
  userName: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userName: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.getUserByUserName(userName);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) return user;

    return null;
  }

  async login(userName: string, password: string) {
    const user = await this.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userName: user.userName,
      sub: user._id.toString(),
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      userName: user.userName,
      role: user.role,
    };
  }

  async getMe(userPayload: JwtPayload) {
    const user = await this.usersService.getUserById(userPayload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id,
      userName: user.userName,
      role: user.role,
    };
  }
}
