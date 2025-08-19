import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


interface JwtPayload  {
  id: string;
  email: string;
  role: string;
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
  const decoded = this.jwtService.verify(token, { secret });
  console.log('Token verified:', decoded, 'Current time:', new Date().toISOString());
  request.user = { id: decoded.id, email: decoded.email, role: decoded.role };
  return true;
} catch (error) {
  console.error('Token verification error:', error.message, 'Token:', token);
  throw new UnauthorizedException(error.message);
}
  }
}