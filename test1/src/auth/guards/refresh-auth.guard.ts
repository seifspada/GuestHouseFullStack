import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../schema/token.schema';
import { User, UserDocument } from '../../user/schema/user.schema'; // Import User schema

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refreshToken } = request.body;

    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    const storedToken = await this.tokenModel.findOne({ refreshToken }).exec();
    if (!storedToken) throw new UnauthorizedException('Invalid refresh token');

    if (storedToken.expiresAt < new Date()) {
      await this.tokenModel.deleteOne({ refreshToken }).exec();
      throw new UnauthorizedException('Refresh token has expired');
    }

    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) throw new UnauthorizedException('JWT refresh secret not configured');

    try {
      const payload = this.jwtService.verify(refreshToken, { secret });
      const user = await this.userModel.findById(payload.sub).exec();
      if (!user) throw new UnauthorizedException('User not found');
      request.user = { id: payload.sub, email: user.email, role: user.role };
      return true;
    } catch (error) {
      await this.tokenModel.deleteOne({ refreshToken }).exec();
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}