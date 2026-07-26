import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refreshTokens(req: Request, user: any): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: Request, user: any): Promise<{
        success: boolean;
    }>;
    googleAuth(req: Request): Promise<void>;
    googleAuthRedirect(req: Request): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
}
