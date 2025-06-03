import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'), // ✅ this must match exactly
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      fullName: payload.fullName,
      phone: payload.phone,
      role: payload.role,
      plan: payload.plan,
    };
  }
}
