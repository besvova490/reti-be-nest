import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';

// services
import { UsersService } from '../users/users.service';

// dtos
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';

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
      throw new BadRequestException({ errors: { email: 'email in use' } });
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

    if (user.isTwoFactorAuthEnabled) {
      return { isTwoFactorAuthEnabled: user.isTwoFactorAuthEnabled };
    }

    return this.getTokens(user.id, user.email);
  }

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
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Access Denied');
    }
  }

  // TODO move all two-factor logic to a separate service
  async twoFactor(user: User) {
    if (user.isTwoFactorAuthEnabled) {
      throw new BadRequestException('two-factor auth is already enabled');
    }

    const secret = speakeasy.generateSecret({
      name: `Rate it: ${user.email}`,
      length: 20,
    });

    await this.usersService.update(user.id, {
      twoFactorAuthSecret: secret.base32,
    } as UpdateUserDto);

    return { token: secret.otpauth_url };
  }

  async twoFactorConfirm(user: User, twoFactorCode: string) {
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthSecret,
      encoding: 'base32',
      token: twoFactorCode,
    });

    if (!verified) {
      throw new BadRequestException('invalid two-factor code');
    }

    await this.usersService.update(user.id, {
      isTwoFactorAuthEnabled: true,
    } as UpdateUserDto);

    return;
  }

  async twoFactorRemove(user: User) {
    await this.usersService.update(user.id, {
      isTwoFactorAuthEnabled: false,
      twoFactorAuthSecret: null,
    } as UpdateUserDto);

    return;
  }

  async twoFactorVerifier(email: string, twoFactorCode: string) {
    const userRepo = await this.usersService.findOne({ email });

    if (!userRepo) {
      throw new BadRequestException('invalid email');
    }

    if (!userRepo.isTwoFactorAuthEnabled) {
      throw new BadRequestException('two-factor auth is not enabled');
    }

    const verified = speakeasy.totp.verify({
      secret: userRepo.twoFactorAuthSecret,
      encoding: 'base32',
      token: twoFactorCode,
    });

    if (!verified) {
      throw new BadRequestException('invalid two-factor code');
    }

    return this.getTokens(userRepo.id, userRepo.email);
  }

  private async getTokens(id: number, email: string, expiresIn?: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.getOrThrow('NEST_JWT_ACCESS_SECRET'),
          expiresIn:
            expiresIn ||
            this.configService.getOrThrow('NEST_JWT_ACCESS_EXPIRATION_TIME'),
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
