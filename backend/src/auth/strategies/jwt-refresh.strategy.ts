import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../common/interfaces/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_REFRESH_SECRET ||
        'change_me_refresh_secret_min_32_chars',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }): Promise<User> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException();
    return Promise.resolve({
      userId: payload.sub,
      username: '',
      role: 'CUSTOMER',
      refreshToken,
    } as User);
  }
}
