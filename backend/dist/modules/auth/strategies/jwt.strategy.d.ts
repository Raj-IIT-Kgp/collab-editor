import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
        email: string;
        password: string | null;
        name: string;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        id: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
