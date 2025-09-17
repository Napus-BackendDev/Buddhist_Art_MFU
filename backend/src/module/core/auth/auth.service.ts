import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUser, LoginResult } from 'src/common/interface/auth-interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(studentId: string, password: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByStudentID(studentId);
    if (user && (await bcrypt.compare(password, user.password))) {
      user.toObject()
      return {
          _id: user._id.toString(),
          studentId: user.studentId,
          username: user.username,
          role: user.role
      };
    }
    return null;
  }

  async login(user: AuthUser):Promise<LoginResult> {
    const payload = { username: user.username , studentId: user.studentId, sub: user._id , role: user.role };
    return {
      access_Token: this.jwtService.sign(payload),
    };
  }
}
