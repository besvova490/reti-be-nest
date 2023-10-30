import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// services
import { UsersService } from '../users/users.service';

// entities
import { User } from '../users/user.entity';

interface RequestWithUser extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('NEST_JWT_ACCESS_SECRET'),
      });

      const user = await this.usersService.findOne({ id: sub });
      req.currentUser = user;

      next();
    } catch {
      next();
    }
  }
}
