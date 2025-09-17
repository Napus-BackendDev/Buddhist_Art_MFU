import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalStrategy)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_Token } = await this.authService.login(req.user);
    res.cookie('access_Token', access_Token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { message: 'Successfully Logging in' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    const user = this.userService.findByStudentID(req.user.studentId);
    return user;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_Token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Logout successful.' };
  }
}
