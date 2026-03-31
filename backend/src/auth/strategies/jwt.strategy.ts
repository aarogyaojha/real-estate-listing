import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../common/interfaces/user.interface';
import { UserRole } from '@prisma/client';

interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => 
          (req.cookies as Record<string, string | undefined>)?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_ACCESS_SECRET || 'change_me_access_secret_min_32_chars',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return Promise.resolve({
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    });
  }
}
