import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive httpOnly JWT cookies' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Sets access_token and refresh_token cookies' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'ok', username: result.username, isAdmin: result.isAdmin };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Sets new access_token and refresh_token cookies' })
  async refresh(@Req() req: Request, @CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.refreshTokens(user.userId, user.refreshToken);
    
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: 'ok' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Logout and clear cookies' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'logged out' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get current logged in user' })
  @ApiResponse({ status: 200, description: 'Returns user info' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getMe(@CurrentUser() user: any) {
    return { userId: user.userId, username: user.username, isAdmin: user.isAdmin };
  }
}
