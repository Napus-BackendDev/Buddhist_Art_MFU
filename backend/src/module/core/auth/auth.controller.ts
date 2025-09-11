import { Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @UseGuards(LocalStrategy)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_Token } = await this.authService.login(req.user);
    res.cookie('access_Token', access_Token, {
      httpOnly: true,
    });
    return { message: 'Successfully Logging in' };
  }


  @UseGuards(LocalStrategy)
  @Post('/logout')
  async logout(@Request() req) {
    return req.logout()
  }
}
