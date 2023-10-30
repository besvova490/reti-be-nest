import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// guards
import { RefreshTokenGuard } from './guards/refreshToken.guard';

// services
import { UsersService } from '../users/users.service';

// dtos
import { CreateUserDto } from '../users/dtos/create-user.dto';

// entities
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

const passwordToHash = async (password: string, defaultSalt?: string) => {
  const salt = defaultSalt || randomBytes(8).toString('hex');
  const buf = (await scrypt(password, salt, 32)) as Buffer;
  const hashedPassword = buf.toString('hex');

  return [`${salt}.${buf.toString('hex')}`, hashedPassword];
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(data: Partial<CreateUserDto>) {
    const userCheck = await this.usersService.findOne({ email: data.email });

    if (userCheck) {
      throw new BadRequestException('email in use');
    }

    const [hashedPassword] = await passwordToHash(data.password);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    } as User);

    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    const [salt, storedPassword] = user.password.split('.');
    const [_, hashedPassword] = await passwordToHash(password, salt);

    if (storedPassword !== hashedPassword) {
      throw new BadRequestException('invalid credentials');
    }

    return this.getTokens(user.id, user.email);
  }

  @UseGuards(RefreshTokenGuard)
  async refresh(refreshToken: string) {
    try {
      const data = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('NEST_JWT_REFRESH_SECRET'),
      });

      const tokens = await this.getTokens(data.id, data.email);

      return {
        accessToken: tokens.accessToken,
        refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Access Denied');
    }
  }

  async getTokens(id: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.getOrThrow('NEST_JWT_ACCESS_SECRET'),
          expiresIn: this.configService.getOrThrow(
            'NEST_JWT_ACCESS_EXPIRATION_TIME',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.getOrThrow('NEST_JWT_REFRESH_SECRET'),
          expiresIn: this.configService.getOrThrow(
            'NEST_JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
