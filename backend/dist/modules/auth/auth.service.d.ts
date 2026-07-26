import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../common/database/prisma.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly mailService;
    private readonly prisma;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, mailService: MailService, prisma: PrismaService);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    googleLogin(req: any): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        success: boolean;
    }>;
    private generateTokens;
}
